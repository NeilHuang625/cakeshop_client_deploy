import { useContext, useState } from "react";
import CakeContext from "../../contexts/CakeContext";
import OrderContext from "../../contexts/OrderProvider";
import { Divider } from "@mui/material";
import OrderItem from "../OrderItem";
import { Chip } from "@mui/joy";

import AlertDialog from "../AlertDialog";
import { AuthContext } from "../../contexts/AuthProvider";
import { deleteOrder, updateOrder } from "../../services/apiOrder";
import { useNavigate, useParams } from "react-router-dom";
import SwitchButton from "../SwitchButton";

const CustomerOrderDetail = () => {
  const { selectedOrderId } = useParams();
  const { cakes } = useContext(CakeContext);
  const { orders, setOrders } = useContext(OrderContext);
  const { jwt } = useContext(AuthContext);

  const order = orders.find((o) => o.id === selectedOrderId);

  const [open, setOpen] = useState(false);
  const [paymentChecked, setPaymentChecked] = useState(order?.paymentStatus);
  const [statusChecked, setStatusChecked] = useState(
    order?.orderStatus === "Confirmed" || order?.orderStatus === "Completed",
  );
  const navigate = useNavigate();

  if (!order) {
    return <p>Order not found or was cancelled by customer!</p>;
  }

  const isCompleted = order.orderStatus === "Completed";

  const handleOrderDelete = async () => {
    const result = await deleteOrder(order.id, jwt);

    if (result.success) {
      setOrders(orders.filter((o) => o.id !== order.id));
      setOpen(false);
      navigate("/customer-orders");
    } else {
      console.log(result.message);
    }
  };

  const handlePaymentUpdate = async (newPaymentStatus) => {
    const newOrder = { ...order, paymentStatus: newPaymentStatus };
    const result = await updateOrder(order.id, jwt, newOrder);
    if (result.success) {
      setOrders(
        orders.map((o) =>
          o.id === order.id
            ? {
                ...o,
                paymentStatus: newPaymentStatus,
              }
            : o,
        ),
      );
    } else {
      console.log(result.message);
    }
  };

  const handleStatusUpdate = async (newStatusStatus) => {
    const newOrder = {
      ...order,
      orderStatus: newStatusStatus
        ? isCompleted
          ? "Completed"
          : "Confirmed"
        : "Pending",
    };
    const result = await updateOrder(order.id, jwt, newOrder);

    if (result.success) {
      setOrders(
        orders.map((o) =>
          o.id === order.id
            ? {
                ...o,
                orderStatus: newStatusStatus
                  ? isCompleted
                    ? "Completed"
                    : "Confirmed"
                  : "Pending",
              }
            : o,
        ),
      );
    } else {
      console.log(result.message);
    }
  };

  const handleDoneClick = async () => {
    const newOrder = {
      ...order,
      orderStatus: "Completed",
    };
    const result = await updateOrder(order.id, jwt, newOrder);

    if (result.success) {
      setOrders(
        orders.map((o) =>
          o.id === order.id
            ? {
                ...o,
                orderStatus: "Completed",
              }
            : o,
        ),
      );
    } else {
      console.log(result.message);
    }
  };

  return (
    <div>
      <p className="inline-block rounded-full bg-white py-2 text-xl text-amber-500">
        Order#: {order.id}
      </p>
      <Divider className="py-2" />
      <p className="py-4 font-semibold text-gray-500">Order Items:</p>
      <div className="rounded-lg border border-dashed border-amber-500 px-4 py-2">
        {order.orderItems.map((item, index) => (
          <OrderItem
            key={item.cakeId}
            item={item}
            cakes={cakes}
            isLast={index === order.orderItems.length - 1}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 p-2 md:grid-cols-8 md:p-4">
        <div className="hidden md:col-span-4 md:block"></div>
        <p className="col-span-2 md:col-span-1">Payment:</p>
        <Chip
          variant="soft"
          color="danger"
          sx={{ fontWeight: paymentChecked ? "normal" : "bold" }}
        >
          Unpaid
        </Chip>
        <SwitchButton
          type="payment"
          checked={paymentChecked}
          setChecked={setPaymentChecked}
          handlePaymentUpdate={handlePaymentUpdate}
          disabled={isCompleted}
        />
        <Chip
          variant="soft"
          color="success"
          sx={{ fontWeight: paymentChecked ? "bold" : "normal" }}
        >
          Paid
        </Chip>
        <div className="hidden md:col-span-4 md:block"></div>
        <p className="col-span-2 md:col-span-1">Status: </p>
        <Chip
          variant="soft"
          color="danger"
          sx={{ fontWeight: statusChecked ? "normal" : "bold" }}
        >
          Pending
        </Chip>
        <SwitchButton
          type="status"
          checked={statusChecked}
          setChecked={setStatusChecked}
          handleStatusUpdate={handleStatusUpdate}
          disabled={isCompleted}
        />
        <Chip
          variant="soft"
          color="success"
          sx={{ fontWeight: statusChecked ? "bold" : "normal" }}
        >
          Confirmed
        </Chip>
        <div className="hidden md:col-span-4 md:block"></div>
        <p className="col-span-2 md:col-span-1">Total:</p>

        <p className="col-span-3 text-right font-semibold">
          NZ$
          {order.orderItems.reduce(
            (acc, item) => acc + item.quantity * item.cakePrice,
            0,
          )}
        </p>
      </div>
      <div className="mt-5 flex justify-end space-x-6 pr-4">
        <button
          className="rounded-full border border-gray-100 px-3.5 py-2 text-sm font-semibold shadow-lg transition-all duration-200 hover:cursor-pointer hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          Cancel
        </button>
        <button
          onClick={handleDoneClick}
          disabled={isCompleted}
          className={`${isCompleted ? "cursor-not-allowed" : "hover:cursor-pointer hover:border-gray-100 hover:bg-gray-200 hover:text-amber-600"} rounded-full border border-amber-400 bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-lg duration-200`}
        >
          {isCompleted ? "Completed" : "Done"}
        </button>
        <AlertDialog
          type="cancel"
          open={open}
          setOpen={setOpen}
          title="Cancel Order"
          message="Are you sure you want to cancel this order?"
          action={handleOrderDelete}
          actionName="Yes"
        />
      </div>
    </div>
  );
};
export default CustomerOrderDetail;
