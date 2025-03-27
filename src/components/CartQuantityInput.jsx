import React, { useContext, useEffect, useState } from "react";
import { Unstable_NumberInput as BaseNumberInput } from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import { amber } from "@mui/material/colors";
import { updateCartQuantity } from "../services/apiCart";
import { AuthContext } from "../contexts/AuthProvider";
import CartContext from "../contexts/CartContext";

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInput,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: <AddIcon fontSize="small" />,
          className: "increment",
        },
        decrementButton: {
          children: <RemoveIcon fontSize="small" />,
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function CartQuantityInput({ cart }) {
  const [quantity, setQuantity] = useState(cart.quantity);
  const { jwt } = useContext(AuthContext);
  const { carts, setCarts } = useContext(CartContext);

  // Update the value in the NumberInput when the quantity changes
  useEffect(() => {
    setQuantity(cart.quantity);
  }, [cart.quantity]);

  const handleChange = async (event, value) => {
    // setQuantity(value);
    const newCart = { ...cart, quantity: value };
    const result = await updateCartQuantity(newCart, jwt);
    if (result.success) {
      const updatedCarts = carts.map((c) =>
        c.id === newCart.id ? newCart : c,
      );
      setCarts(updatedCarts);
    } else {
      console.error("Error:", result.message);
    }
  };

  return (
    <NumberInput
      aria-label="Quantity Input"
      min={1}
      max={99}
      value={quantity}
      onChange={handleChange}
    />
  );
}

CartQuantityInput.propTypes = {
  cart: PropTypes.object.isRequired,
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[500]};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`,
);

const StyledInput = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  border-radius: 8px;
  margin: 0 8px;
  padding: 4px 8px;
  width: 3rem;
  outline: 0;
  min-width: 0;
  text-align: center;

  &:hover {
    border-color: ${amber[400]};
  }

  &:focus {
    border-color: ${amber[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? amber[700] : amber[200]};
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledButton = styled("button")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px solid;
  border-radius: 8px;
  border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  width: 24px;
  height:24px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? amber[700] : amber[500]};
    border-color: ${theme.palette.mode === "dark" ? amber[500] : amber[400]};
    color: ${grey[50]};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`,
);
