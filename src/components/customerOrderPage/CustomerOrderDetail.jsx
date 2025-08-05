import { useContext, useState } from "react";
import OrderContext from "../../contexts/OrderProvider";
import { Chip } from "@mui/joy";

import AlertDialog from "../AlertDialog";
import { AuthContext } from "../../contexts/AuthProvider";
import { deleteOrder, updateOrder } from "../../services/apiOrder";
import { useNavigate, useParams } from "react-router-dom";
import SwitchButton from "../SwitchButton";

const CustomerOrderDetail = () => {
  const { selectedOrderId } = useParams();
  const { orders, setOrders } = useContext(OrderContext);
  const { jwt, users } = useContext(AuthContext);

  const order = orders.find((o) => o.id === selectedOrderId);
  const user = users.find((u) => u.id === order?.userId);

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
      // Update local state to reflect the changes
      setStatusChecked(true);
    } else {
      console.log(result.message);
    }
  };

  return (
    <div className="w-full max-w-none mx-auto p-2 sm:p-4 lg:p-6">
      {/* Main Order Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Compact Header Row */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <h1 className="text-lg sm:text-xl font-bold text-amber-700">Order #{order.id}</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {new Date(order.createdDate).toLocaleDateString('en-NZ', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs text-gray-600 font-medium">Payment:</span>
                <Chip
                  variant="soft"
                  color={paymentChecked ? "success" : "danger"}
                  size="sm"
                >
                  {paymentChecked ? "Paid" : "Unpaid"}
                </Chip>
                <SwitchButton
                  type="payment"
                  checked={paymentChecked}
                  setChecked={setPaymentChecked}
                  handlePaymentUpdate={handlePaymentUpdate}
                  disabled={false}
                />
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs text-gray-600 font-medium">Status:</span>
                <Chip
                  variant="soft"
                  color={statusChecked ? "success" : "warning"}
                  size="sm"
                >
                  {statusChecked ? "Confirmed" : "Pending"}
                </Chip>
                <SwitchButton
                  type="status"
                  checked={statusChecked}
                  setChecked={setStatusChecked}
                  handleStatusUpdate={handleStatusUpdate}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          
          {/* Customer Section */}
          <div className="p-4 sm:p-5 lg:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Customer
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Name:</span>
                <p className="font-medium text-sm sm:text-base">{user.username}</p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Email:</span>
                <p className="font-medium text-sm sm:text-base break-all">{user.email}</p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Phone:</span>
                <p className="font-medium text-sm sm:text-base">{user.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Delivery Section */}
          <div className="p-4 sm:p-5 lg:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
              </svg>
              Delivery
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Date & Time:</span>
                <p className="font-medium text-sm sm:text-base">
                  {new Date(order.deliveryInfo.deliveryDate).toLocaleDateString('en-NZ', {
                    month: 'short',
                    day: 'numeric'
                  })} at {order.deliveryInfo.deliveryTime}
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Address:</span>
                <p className="font-medium text-sm sm:text-base">{order.deliveryInfo.address}</p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Recipient:</span>
                <p className="font-medium text-sm sm:text-base">{order.deliveryInfo.recipientName}</p>
                <p className="text-xs sm:text-sm text-gray-600">{order.deliveryInfo.recipientPhone}</p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm block">Payment:</span>
                <p className="font-medium text-sm sm:text-base capitalize">{order.deliveryInfo.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div className="p-4 sm:p-5 lg:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Message
            </h3>
            {order.deliveryInfo.message ? (
              <div className="bg-gray-50 p-3 sm:p-4 rounded border">
                <p className="text-sm sm:text-base italic text-gray-700">"{order.deliveryInfo.message}"</p>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 italic">No special message</p>
            )}
          </div>

          {/* Order Items Section */}
          <div className="p-4 sm:p-5 lg:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" clipRule="evenodd" />
              </svg>
              Items ({order.orderItems.length})
            </h3>
            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
              {order.orderItems.map((item) => (
                <div key={item.cakeId} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-amber-50 rounded border border-amber-200">
                  <img 
                    src={item.cakeImage} 
                    alt={item.cakeName}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">{item.cakeName}</p>
                    <p className="text-xs text-gray-600">{item.cakeSize}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs sm:text-sm text-gray-600">×{item.quantity}</span>
                      <span className="text-xs sm:text-sm font-semibold text-amber-700">NZ${item.cakePrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section with Total and Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col justify-end items-end gap-4">
            {/* Total Amount */}
            <div className="text-right">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                NZ${order.orderItems.reduce(
                  (acc, item) => acc + item.quantity * item.cakePrice,
                  0,
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 sm:space-x-3">
              <button
                className="px-3 sm:px-4 lg:px-6 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(true)}
              >
                Cancel Order
              </button>
              <button
                onClick={handleDoneClick}
                disabled={isCompleted}
                className={`px-4 sm:px-6 lg:px-8 py-2 rounded text-sm font-medium transition-colors ${
                  isCompleted
                    ? "bg-green-100 text-green-800 cursor-not-allowed"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {isCompleted ? "✓ Completed" : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      </div>

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
  );
};
export default CustomerOrderDetail;
