import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import CakeContext from "../contexts/CakeContext";
import OrderContext from "../contexts/OrderProvider";
import { Divider, Typography } from "@mui/material";
import OrderItem from "../components/OrderItem";
import { Chip } from "@mui/joy";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import { MdOutlinePending } from "react-icons/md";
import AlertDialog from "../components/AlertDialog";
import { AuthContext } from "../contexts/AuthProvider";
import { deleteOrder } from "../services/apiOrder";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();
  const { cakes } = useContext(CakeContext);
  const { orders, setOrders } = useContext(OrderContext);
  const { jwt } = useContext(AuthContext);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Typography level="body-md" sx={{ textAlign: "center", mt: 4 }}>
        Order not found or has been deleted
      </Typography>
    );
  }

  const handleOrderDelete = async () => {
    const result = await deleteOrder(order.id, jwt);

    if (result.success) {
      setOrders(orders.filter((o) => o.id !== order.id));
      setOpen(false);
      navigate("/orders");
    } else {
      setErrorMessage(result.message);
      setOpen(true);
    }
  };

  return (
    <div className="mx-auto my-8 max-w-5xl rounded-2xl bg-gray-100 px-2 py-1 sm:px-4 sm:py-8">
      <p className="inline-block rounded-full bg-white px-4 py-2 text-xl text-amber-500">
        Order#: {order.id}
      </p>
      <Divider className="py-2" />
      <p className="py-4 font-semibold text-gray-500">Order Items:</p>
      <div className="rounded-lg border border-dashed border-amber-500 p-4">
        {order.orderItems.map((item, index) => (
          <OrderItem
            key={item.cakeId}
            item={item}
            cakes={cakes}
            isLast={index === order.orderItems.length - 1}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-2"></div>
        <p className="col-span-1 text-right">Payment:</p>
        <div className="col-span-1 flex justify-end">
          <Chip
            variant="soft"
            size="sm"
            startDecorator={
              order.paymentStatus ? <CheckRoundedIcon /> : <BlockIcon />
            }
            color={order.paymentStatus ? "success" : "danger"}
          >
            {order.paymentStatus ? "Paid" : "Unpaid"}
          </Chip>
        </div>
        <div className="col-span-2"></div>
        <p className="col-span-1 text-right">Status: </p>
        <div className="col-span-1 flex justify-end">
          <Chip
            variant="soft"
            size="sm"
            startDecorator={
              order.orderStatus === "Completed" ? (
                <CheckRoundedIcon />
              ) : order.orderStatus === "Cancelled" ? (
                <BlockIcon />
              ) : order.orderStatus === "Confirmed" ? (
                <CheckRoundedIcon />
              ) : (
                <MdOutlinePending fontSize={24} />
              )
            }
            color={
              order.orderStatus === "Completed" ||
              order.orderStatus === "Confirmed"
                ? "success"
                : "danger"
            }
          >
            {order.orderStatus}
          </Chip>
        </div>
        <div className="col-span-2"></div>
        <p className="col-span-1 text-right">Total:</p>
        <p className="col-span-1 text-right font-semibold">
          NZ$
          {order.orderItems.reduce(
            (acc, item) => acc + item.quantity * item.cakePrice,
            0,
          )}
        </p>
      </div>
      <div className="mt-5 flex justify-end pr-4">
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="rounded-full border border-amber-500 bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-lg duration-200 hover:cursor-pointer hover:border-gray-100 hover:bg-gray-200 hover:text-amber-600"
        >
          Cancel
        </button>
        {errorMessage ? (
          <AlertDialog
            type="warning"
            open={open}
            setOpen={setOpen}
            title="Order has been confirmed"
            message={errorMessage}
            action={() => setOpen(false)}
            actionName="Ok"
          />
        ) : order.orderStatus === "Confirmed" ||
          order.orderStatus === "Completed" ? (
          <AlertDialog
            type="warning"
            open={open}
            setOpen={setOpen}
            title="Order has been confirmed"
            message="Your order has been confirmed or completed. Please contact our customer service for more details."
            action={() => setOpen(false)}
            actionName="Ok"
          />
        ) : (
          <AlertDialog
            type="cancel"
            open={open}
            setOpen={setOpen}
            title="Cancel Order"
            message="Are you sure you want to cancel this order?"
            action={handleOrderDelete}
            actionName="Yes"
          />
        )}
      </div>
    </div>
  );
};
export default OrderDetail;
