import { useContext, useState } from "react";
import PropTypes from "prop-types";
import QuantityInput from "./QuantityInput";
import MUISelect from "./MUISelect";
import { RiShoppingCartLine } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { LuMessageSquareWarning } from "react-icons/lu";
import CartContext from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthProvider";
import { createCart } from "../services/apiCart";
import CartIconContext from "../contexts/CartIconContext";
import FlyToCartAnimation from "./FlyToCartAnimation";
import { useNavigate } from "react-router-dom";
import MessagePopup from "./MessagePopup";

const CakeOptions = ({ cake }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(cake.cakeOptions[0]);
  const { carts, setCarts } = useContext(CartContext);
  const { user, jwt, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [messagePopupOpen, setMessagePopupOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { cartIconRef, cakeDetailPageImageRef } = useContext(CartIconContext);
  const [flyingItem, setFlyingItem] = useState(null);

  const handleOptionChange = (event, value) => {
    const option = cake.cakeOptions.find((o) => o.id === value);
    setSelectedOption(option);
  };

  const handleQuantityChange = (event, value) => {
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage("Please login to add to cart");
      setMessagePopupOpen(true);
      return;
    }

    const cart = {
      cakeId: cake.id,
      cakeImage: cake.cakeImages[0],
      cakeName: cake.cakeName,
      cakePrice: selectedOption.price,
      cakeSize: selectedOption.name,
      optionId: selectedOption.id,
      quantity,
      userId: user.id,
    };

    // Get the position of the add to cart button and cart icon
    if (!cakeDetailPageImageRef.current || !cartIconRef.current) return;

    const imageRect = cakeDetailPageImageRef.current.getBoundingClientRect();
    const cartRect = cartIconRef.current.getBoundingClientRect();

    setFlyingItem({
      image: cake.cakeImages[0],
      x: imageRect.left,
      y: imageRect.top,
      width: imageRect.width,
      height: imageRect.height,
      targetX: cartRect.left,
      targetY: cartRect.top,
    });

    // End after 1 second
    setTimeout(() => setFlyingItem(null), 1000);

    const result = await createCart(cart, jwt);
    if (result.success) {
      const newCart = result.data;
      // Check if the cart already exists
      const existingCart = carts.find((c) => c.id === newCart.id);
      if (existingCart) {
        // Replace the existing cart with the new one
        const updatedCarts = carts.map((c) =>
          c.id === newCart.id ? newCart : c,
        );
        setCarts(updatedCarts);
      } else {
        setCarts((prevCarts) => [...prevCarts, result.data]);
      }
    } else {
      console.error("Error:", result.message);
    }
  };

  const handleCheckOut = async () => {
    if (!isAuthenticated) {
      setMessage("Please login to checkout");
      setMessagePopupOpen(true);
      return;
    }

    const orderData = {
      userId: user.id,
      orderItems: [
        {
          cakeId: cake.id,
          cakeName: cake.cakeName,
          cakeImage: cake.cakeImages[0],
          cakePrice: selectedOption.price,
          cakeSize: selectedOption.name,
          optionId: selectedOption.id,
          quantity,
        },
      ],
    };

    navigate("/checkout", { state: { orderData } });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{cake.cakeName}</h1>
      <p className="text-gray-600">{cake.cakeDescription}</p>

      <p className="text-xl font-semibold">
        Price: ${selectedOption.price * quantity}
      </p>

      <div>
        <div className="inline-flex flex-col">
          <label className="font-semibold">Size:</label>
          <MUISelect
            options={cake.cakeOptions}
            onChange={handleOptionChange}
            type="objectOption"
            width="200px"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <QuantityInput
          quantity={quantity}
          handleQuantityChange={handleQuantityChange}
          min={1}
        />
      </div>

      <div className="mt-2 flex gap-4">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-6 py-3 text-sm transition-all duration-200 hover:cursor-pointer hover:bg-gray-100"
        >
          <RiShoppingCartLine className="h-4.5 w-4.5" />
          Add to Cart
        </button>
        <button
          onClick={handleCheckOut}
          className="flex items-center justify-center gap-1 rounded-xl bg-amber-500 px-6 py-3 text-sm text-white transition-all duration-200 hover:cursor-pointer hover:bg-amber-600"
        >
          <IoBagCheckOutline className="h-4.5 w-4.5" />
          Check it Out
        </button>
      </div>

      {/* flying item */}
      <FlyToCartAnimation flyingItem={flyingItem} />

      {/* Message Popup */}
      <MessagePopup
        color="warning"
        icon={<LuMessageSquareWarning className="h-5 w-5" />}
        open={messagePopupOpen}
        setOpen={setMessagePopupOpen}
        message={message}
        vertical="top"
        horizontal="center"
        buttonLabel="Login"
        buttonAction={() => navigate("/login")}
      />
    </div>
  );
};

CakeOptions.propTypes = {
  cake: PropTypes.object.isRequired,
};

export default CakeOptions;
