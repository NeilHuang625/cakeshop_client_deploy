import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import CartItem from "./CartItem";
import { RiShoppingCartLine } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createOrder } from "../services/apiOrder";
import { useContext, useState } from "react";
import OrderContext from "../contexts/OrderProvider";
import { deleteAllCartsByUserId } from "../services/apiCart";
import { useNavigate } from "react-router-dom";
import { isCakeAvailable } from "../utils";
import MUIPopup from "./MUIPopup";

export default function CartDrawer({
  open,
  toggleDrawer,
  carts,
  setCarts,
  jwt,
  cakes,
  user,
}) {
  const { setOrders } = useContext(OrderContext);
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);

  const totalPrice = carts.reduce(
    (acc, cart) => acc + cart.quantity * cart.cakePrice,
    0,
  );

  const handleProcessOrder = async () => {
    // Check if there is any unavailable cake in the cart
    if (
      carts.some((cart) => isCakeAvailable(user.role, cakes, cart) === false)
    ) {
      // alert("There are unavailable cakes in your cart. Please remove them.");
      setOpenPopup(true);
      return;
    }

    const newOrder = {
      userId: carts[0].userId,
      orderItems: carts.map((cart) => ({
        cakeId: cart.cakeId,
        cakeName: cart.cakeName,
        cakeImage: cart.cakeImage,
        cakePrice: cart.cakePrice,
        cakeSize: cart.cakeSize,
        optionId: cart.optionId,
        quantity: cart.quantity,
      })),
    };

    const result = await createOrder(newOrder, jwt);
    if (result.success) {
      const newOrder = result.data;
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      const res = await deleteAllCartsByUserId(carts[0].userId, jwt);
      if (res.success) {
        setCarts([]);
        navigate(`/orders/${newOrder.id}`);
        toggleDrawer(false)();
      } else {
        console.log(res);
      }
    } else {
      console.log(result);
    }
  };

  const DrawerList = (
    <Box
      role="presentation"
      sx={{
        width: { xs: "100vw", sm: 400 },
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="flex items-center justify-between">
        <Typography
          variant="h6"
          sx={{
            p: 2,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <RiShoppingCartLine size={28} />
          Your Cart
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ mr: 2 }}>
          <CloseIcon sx={{ fontSize: "28px", color: "grey.700" }} />
        </IconButton>
      </div>
      <Divider />

      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {carts.length > 0 ? (
          carts.map((cart) => <CartItem key={cart.id} cart={cart} />)
        ) : (
          <Typography sx={{ p: 2, textAlign: "center", color: "gray" }}>
            Your cart is empty.
          </Typography>
        )}
      </List>

      <Divider />
      <Typography
        sx={{
          px: 2,
          pt: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        Total: NZ$ {totalPrice}
      </Typography>
      <Box
        sx={{
          px: 2,
          pb: 3,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <button
          onClick={() => {
            navigate("/cakes");
            toggleDrawer(false)();
          }}
          className="flex items-center justify-center gap-1 rounded-full border border-gray-200 px-3.5 py-2.5 text-sm shadow-xl transition-all duration-200 hover:cursor-pointer hover:bg-gray-100"
        >
          <RiShoppingCartLine className="h-5 w-5" />
          <p>Continue Shopping</p>
        </button>
        <button
          disabled={carts.length === 0}
          onClick={handleProcessOrder}
          className={`flex items-center justify-center gap-1 rounded-full bg-amber-500 px-6 py-2.5 text-sm text-white shadow-xl transition-all duration-200 ${carts.length === 0 ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:bg-amber-600"} `}
        >
          <IoBagCheckOutline className="h-5 w-5" />
          <p>Process Order</p>
        </button>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
      >
        {DrawerList}
      </Drawer>
      <MUIPopup
        open={openPopup}
        setOpen={setOpenPopup}
        title="Sorry"
        message="There are unavailable cakes in your cart. Please remove them first."
      />
    </div>
  );
}

CartDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  carts: PropTypes.array.isRequired,
  setCarts: PropTypes.func.isRequired,
  jwt: PropTypes.string.isRequired,
  cakes: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};
