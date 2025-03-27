import OrderContext from "../contexts/OrderProvider";
import { Chip, Typography, Table } from "@mui/joy";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import { MdOutlinePending } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const Orders = () => {
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isAdmin = user?.role === "admin";
  const ordersToShow = isAdmin
    ? orders.filter((order) => order.userId === user.id)
    : orders;

  const getOrderTotal = (order) => {
    return order.orderItems.reduce(
      (acc, orderItem) => acc + orderItem.cakePrice * orderItem.quantity,
      0,
    );
  };

  return (
    <>
      {ordersToShow.length > 0 ? (
        <div className="mx-auto my-10 max-w-5xl">
          <Table
            className="hidden bg-gray-100 p-3 md:table"
            aria-labelledby="tableTitle"
            stickyHeader
            hoverRow
            sx={{ borderRadius: "18px" }}
          >
            <thead>
              <tr>
                <th style={{ width: "7%" }}></th>
                <th style={{ width: "26%" }}>Order#</th>
                <th style={{ width: "13%" }}>Date</th>
                <th style={{ width: "15%" }}>Status</th>
                <th style={{ width: "15%" }}>Payment</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordersToShow.map((order, index) => (
                <tr key={order.id} style={{ height: "60px" }}>
                  <td>{index + 1}</td>
                  <td>#{order.id}</td>
                  <td>
                    {new Date(order.createdDate).toLocaleString("en-NZ", {
                      timeZone: "Pacific/Auckland",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        order.orderStatus === "Completed" ||
                        order.orderStatus === "Confirmed" ? (
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
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        order.paymentStatus ? (
                          <CheckRoundedIcon />
                        ) : (
                          <BlockIcon />
                        )
                      }
                      color={order.paymentStatus ? "success" : "danger"}
                    >
                      {order.paymentStatus ? "Paid" : "Unpaid"}
                    </Chip>
                  </td>
                  <td>NZ$ {getOrderTotal(order)}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="rounded-full border border-amber-500 bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg duration-200 hover:cursor-pointer hover:border-white hover:bg-white hover:text-amber-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="flex flex-col gap-5 px-4 md:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg bg-gray-100 px-4 py-3 text-gray-700 shadow-md"
              >
                <Typography level="h6" className="font-semibold">
                  Order #{order.id}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  {new Date(order.createdDate).toLocaleString("en-NZ", {
                    timeZone: "Pacific/Auckland",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
                <div className="mt-2 flex items-center justify-between">
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      order.orderStatus === "Completed" ||
                      order.orderStatus === "Confirmed" ? (
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
                <Typography className="mt-2 py-2 text-lg font-bold text-gray-700">
                  Total: NZ$ {getOrderTotal(order)}
                </Typography>
                <div className="flex justify-center">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="my-3 w-2/3 rounded-full border border-amber-500 bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg duration-200 hover:cursor-pointer hover:border-white hover:bg-white hover:text-amber-600"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Typography
          level="h6"
          sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
        >
          No orders found.
        </Typography>
      )}
    </>
  );
};

export default Orders;
