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
    <div className="mx-auto my-8 max-w-5xl rounded-2xl bg-gray-100 p-4">
      <p className="inline-block rounded-full bg-white px-4 py-2 text-l text-amber-500">
        Order #: {order.id}
      </p>
      <Divider className="py-2" />
      
      {/* Order Items Section */}
      <p className="py-2 font-semibold text-gray-500">Order Items:</p>
      <div className="rounded-lg border border-dashed border-amber-500 p-3 mb-4">
        {order.orderItems.map((item, index) => (
          <OrderItem
            key={item.cakeId}
            item={item}
            cakes={cakes}
            isLast={index === order.orderItems.length - 1}
          />
        ))}
      </div>

      {/* Delivery Information Section */}
      <p className="py-2 font-semibold text-gray-500">Delivery Information:</p>
      <div className="rounded-lg border border-dashed border-blue-400 p-3 bg-blue-50 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-600">Date:</span>
            <span className="ml-2 font-medium">{order.deliveryInfo.deliveryDate}</span>
          </div>
          <div>
            <span className="text-gray-600">Time:</span>
            <span className="ml-2 font-medium">{order.deliveryInfo.deliveryTime}</span>
          </div>
          <div>
            <span className="text-gray-600">Payment:</span>
            <span className="ml-2 font-medium capitalize">{order.deliveryInfo.paymentMethod}</span>
          </div>
          <div>
            <span className="text-gray-600">Phone:</span>
            <span className="ml-2 font-medium">{order.deliveryInfo.recipientPhone}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Recipient:</span>
            <span className="ml-2 font-medium">{order.deliveryInfo.recipientName}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Address:</span>
            <span className="ml-2 font-medium">{order.deliveryInfo.address}</span>
          </div>
          {order.deliveryInfo.message && (
            <div className="col-span-full">
              <span className="text-gray-600">Message:</span>
              <span className="ml-2 font-medium italic">{order.deliveryInfo.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">{new Date(order.createdDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment:</span>
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
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
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
                  <MdOutlinePending fontSize={16} />
                )
              }
              color={
                order.orderStatus === "Completed" ||
                order.orderStatus === "Confirmed"
                  ? "success"
                  : order.orderStatus === "Cancelled"
                  ? "danger"
                  : "warning"
              }
            >
              {order.orderStatus}
            </Chip>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-700">Total:</span>
            <span className="text-amber-600">NZ${order.totalAmount}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
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
