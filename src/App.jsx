import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import AboutUs from "./pages/AboutUs";
import AppLayout from "./pages/AppLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import PageNotFound from "./pages/PageNotFound";
import { AuthProvider } from "./contexts/AuthProvider";
import AddCake from "./pages/AddCake";
import PrivateRoute from "./components/PrivateRoute";
import { CakeProvider } from "./contexts/CakeContext";
import ManageCake from "./pages/ManageCake";
import EditCake from "./pages/EditCake";
import CakeDetail from "./pages/CakeDetail";
import { CartContextProvider } from "./contexts/CartContext";
import { CartIconProvider } from "./contexts/CartIconContext";
import { OrderProvider } from "./contexts/OrderProvider";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import CustomerOrder from "./pages/CustomerOrder";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CakeProvider>
          <CartContextProvider>
            <OrderProvider>
              <CartIconProvider>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/cakes" element={<Products />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cakes/:id" element={<CakeDetail />} />
                    <Route
                      path="/add-cake"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <AddCake />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/manage-cake"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <ManageCake />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/edit-cake/:id"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <EditCake />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <PrivateRoute requiredRoles={["user", "admin"]}>
                          <Orders />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/orders/:id"
                      element={
                        <PrivateRoute requiredRoles={["user", "admin"]}>
                          <OrderDetail />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/customer-orders"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <CustomerOrder />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/customer-orders/:selectedOrderId"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <CustomerOrder />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Route>
                </Routes>
              </CartIconProvider>
            </OrderProvider>
          </CartContextProvider>
        </CakeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
export default App;
