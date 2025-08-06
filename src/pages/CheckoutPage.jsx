import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid2,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CartContext from "../contexts/CartContext";
import OrderContext from "../contexts/OrderProvider";
import { AuthContext } from "../contexts/AuthProvider";
import { createOrder } from "../services/apiOrder";
import { deleteAllCartsByUserId } from "../services/apiCart";
import MUIPopup from "../components/MUIPopup";

export default function CheckoutPage() {
  const { carts, setCarts } = useContext(CartContext);
  const { setOrders } = useContext(OrderContext);
  const { jwt, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have single product data from navigation state
  const singleProductData = location.state?.orderData;
  const isFromSingleProduct = !!singleProductData;

  // Use single product data or cart items
  const orderItems = isFromSingleProduct ? singleProductData.orderItems : carts.map((cart) => ({
    cakeId: cart.cakeId,
    cakeName: cart.cakeName,
    cakeImage: cart.cakeImage,
    cakePrice: cart.cakePrice,
    cakeSize: cart.cakeSize,
    optionId: cart.optionId,
    quantity: cart.quantity,
  }));

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryDate: "",
    deliveryTime: "",
    address: "",
    recipientName: "",
    recipientPhone: "",
    message: "",
    paymentMethod: "online",
  });

  const [validationErrors, setValidationErrors] = useState({
    deliveryDate: "",
    deliveryTime: "",
  });

  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.quantity * item.cakePrice,
    0,
  );

  // Get minimum date (24 hours from now)
  const getMinimumDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  };

  // Validate delivery date
  const validateDeliveryDate = (date) => {
    if (!date) return "Delivery date is required";
    
    const selectedDate = new Date(date);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < minDate) {
      return "Please select a date at least 24 hours from now";
    }
    
    return "";
  };

  // Validate delivery time
  const validateDeliveryTime = (time) => {
    if (!time) return "Delivery time is required";
    
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const minTime = 11 * 60; // 11:00 AM
    const maxTime = 20 * 60; // 8:00 PM
    
    if (timeInMinutes < minTime || timeInMinutes > maxTime) {
      return "Delivery time must be between 11:00 AM and 8:00 PM";
    }
    
    return "";
  };

  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for date and time
    if (field === 'deliveryDate') {
      const error = validateDeliveryDate(value);
      setValidationErrors(prev => ({
        ...prev,
        deliveryDate: error
      }));
    } else if (field === 'deliveryTime') {
      const error = validateDeliveryTime(value);
      setValidationErrors(prev => ({
        ...prev,
        deliveryTime: error
      }));
    }
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    const dateError = validateDeliveryDate(deliveryInfo.deliveryDate);
    const timeError = validateDeliveryTime(deliveryInfo.deliveryTime);
    
    setValidationErrors({
      deliveryDate: dateError,
      deliveryTime: timeError,
    });

    if (!deliveryInfo.deliveryDate || !deliveryInfo.deliveryTime || 
        !deliveryInfo.address || !deliveryInfo.recipientName || 
        !deliveryInfo.recipientPhone || dateError || timeError) {
      setPopupMessage("Please fix all validation errors and fill in all required fields.");
      setOpenPopup(true);
      return;
    }

    setIsLoading(true);

    try {
      const newOrder = {
        userId: user.id,
        orderItems: orderItems,
        deliveryInfo: {
          deliveryDate: deliveryInfo.deliveryDate,
          deliveryTime: deliveryInfo.deliveryTime,
          address: deliveryInfo.address,
          recipientName: deliveryInfo.recipientName,
          recipientPhone: deliveryInfo.recipientPhone,
          message: deliveryInfo.message,
          paymentMethod: deliveryInfo.paymentMethod,
        },
        totalAmount: totalPrice,
      };

      const result = await createOrder(newOrder, jwt);
      if (result.success) {
        const createdOrder = result.data;
        setOrders((prevOrders) => [...prevOrders, createdOrder]);
        
        // Only clear cart if checkout was from cart, not from single product
        if (!isFromSingleProduct) {
          const res = await deleteAllCartsByUserId(user.id, jwt);
          if (res.success) {
            setCarts([]);
          } else {
            console.log(res);
          }
        }
        
        navigate(`/orders/${createdOrder.id}`);
      } else {
        setPopupMessage("Failed to create order. Please try again.");
        setOpenPopup(true);
      }
    } catch (error) {
      console.error(error);
      setPopupMessage("An error occurred. Please try again.");
      setOpenPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5">No items to checkout</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/cakes")}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>

      <Grid2 container spacing={4}>
        {/* Order Details - Left Side */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                NZ$ {totalPrice.toFixed(2)}
              </Typography>
            </Box>
            
            {orderItems.map((item, index) => (
              <Box key={isFromSingleProduct ? index : item.id} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #eee" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <img 
                    src={item.cakeImage} 
                    alt={item.cakeName}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.cakeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.cakeSize} | Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      NZ$ {(item.quantity * item.cakePrice).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Payment Method */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Payment Method
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup
                value={deliveryInfo.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
              >
                <FormControlLabel 
                  value="online" 
                  control={<Radio />} 
                  label="Online Transfer" 
                />
                <FormControlLabel 
                  value="cash" 
                  control={<Radio />} 
                  label="Cash on Delivery" 
                />
              </RadioGroup>
            </FormControl>

            {/* Payment Instructions for Online Transfer */}
            {deliveryInfo.paymentMethod === "online" && (
              <Box sx={{ p: 2, bgcolor: "blue.50", borderRadius: 1, border: "1px solid #e3f2fd" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Account:</strong> 01-0123-0123456-00
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Account Name:</strong> Okeyii Cake Shop
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Amount:</strong> NZ$ {totalPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Reference:</strong> Order-{user?.name || user?.email}-{new Date().getTime().toString().slice(-6)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid2>

        {/* Delivery Information - Right Side */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Delivery Information
            </Typography>

            {/* Delivery Terms */}
            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                Delivery Terms:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Free delivery for orders over NZ$ 100
              </Typography>
              <Typography variant="body2">
                • Please ensure someone is available to receive the order
              </Typography>
            </Box>

            {/* Delivery Date & Time */}
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
              <Grid2 size={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Delivery Date *"
                  value={deliveryInfo.deliveryDate}
                  onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                  error={!!validationErrors.deliveryDate}
                  helperText={validationErrors.deliveryDate}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: getMinimumDate() }
                  }}
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Delivery Time *"
                  value={deliveryInfo.deliveryTime}
                  onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                  error={!!validationErrors.deliveryTime}
                  helperText={validationErrors.deliveryTime || "Available: 11:00 AM - 8:00 PM"}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { 
                      min: "11:00",
                      max: "20:00",
                      step: "900" // 15 minute intervals
                    }
                  }}
                />
              </Grid2>
            </Grid2>

            {/* Recipient Information */}
            <TextField
              fullWidth
              label="Delivery Address *"
              value={deliveryInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />

            <Grid2 container spacing={2} sx={{ mb: 2 }}>
              <Grid2 size={6}>
                <TextField
                  fullWidth
                  label="Recipient Name *"
                  value={deliveryInfo.recipientName}
                  onChange={(e) => handleInputChange("recipientName", e.target.value)}
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  fullWidth
                  label="Recipient Phone *"
                  value={deliveryInfo.recipientPhone}
                  onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
                />
              </Grid2>
            </Grid2>

            {/* Message */}
            <TextField
              fullWidth
              label="Special Instructions (Optional)"
              value={deliveryInfo.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              multiline
              rows={3}
              placeholder="Any special delivery instructions or message for the recipient..."
              sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/cakes")}
                sx={{ flex: 1 }}
              >
                Back to Shopping
              </Button>
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={isLoading}
                sx={{ flex: 1, bgcolor: "rgb(245 158 11)", "&:hover": { bgcolor: "rgb(217 119 6)" } }}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>

      <MUIPopup
        open={openPopup}
        setOpen={setOpenPopup}
        title="Notice"
        message={popupMessage}
      />
    </Box>
  );
}
