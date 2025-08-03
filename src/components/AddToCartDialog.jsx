import { useContext, useState } from "react";
import { Dialog, DialogContent, FormControl } from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import QuantityInput from "./QuantityInput";
import MUISelect from "./MUISelect";
import PropTypes from "prop-types";
import { createCart } from "../services/apiCart";
import { AuthContext } from "../contexts/AuthProvider";
import CartContext from "../contexts/CartContext";
import FlyToCartAnimation from "./FlyToCartAnimation";
import CartIconContext from "../contexts/CartIconContext";
import { useNavigate } from "react-router-dom";
import MessagePopup from "./MessagePopup";
import { LuMessageSquareWarning } from "react-icons/lu";

const AddToCartDialog = ({ open, handleClose, cake }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(cake.cakeOptions[0]);
  const [selectedImage, setSelectedImage] = useState(cake.cakeImages[0]);
  const [flyingItem, setFlyingItem] = useState(null);

  const [messagePopupOpen, setMessagePopupOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { user, jwt, isAuthenticated } = useContext(AuthContext);
  const { carts, setCarts } = useContext(CartContext);
  const { cartIconRef, addToCartDialogImageRef } = useContext(CartIconContext);
  const navigate = useNavigate();

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
      quantity,
      cakeImage: cake.cakeImages[0],
      cakeName: cake.cakeName,
      cakePrice: selectedOption.price,
      cakeSize: selectedOption.name,
      optionId: selectedOption.id,
      userId: user.id,
    };

    const result = await createCart(cart, jwt);
    if (result.success) {
      // Get the position of the add to cart button and cart icon
      if (!cartIconRef.current || !addToCartDialogImageRef.current) return;

      const iconRect = cartIconRef.current.getBoundingClientRect();
      const imageRect = addToCartDialogImageRef.current.getBoundingClientRect();

      setFlyingItem({
        image: selectedImage,
        x: imageRect.left,
        y: imageRect.top,
        width: imageRect.width,
        height: imageRect.height,
        targetX: iconRect.left,
        targetY: iconRect.top,
      });

      // End after 1 second
      setTimeout(() => setFlyingItem(null), 800);

      const newCart = result.data;
      const existingCart = carts.find((c) => c.id === newCart.id);
      if (existingCart) {
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

    setTimeout(() => handleClose(), 800);
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      onClick={(e) => e.stopPropagation()}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "0.9rem",
          maxHeight: "90vh",
          "@media (max-width: 640px)": { maxHeight: "80vh" },
        },
      }}
    >
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center">
              {/* Big pic */}
              <img
                ref={addToCartDialogImageRef}
                src={selectedImage}
                alt="Cake"
                className="w-80 rounded-lg object-cover shadow-lg sm:max-h-96 sm:w-full"
              />

              {/* Small pic */}
              <div className="mt-4 flex gap-2">
                {cake.cakeImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Cake Thumbnail"
                    className={`h-16 w-16 cursor-pointer rounded-md border-2 object-cover ${
                      selectedImage === img
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>

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
                  className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-6 py-3 text-sm transition-all duration-200 hover:cursor-pointer hover:border-amber-600/50 hover:text-amber-600"
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
            </div>
          </div>
        </FormControl>
      </DialogContent>
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
    </Dialog>
  );
};

AddToCartDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  cake: PropTypes.object.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
};

export default AddToCartDialog;
