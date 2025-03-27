import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import CakeContext from "../contexts/CakeContext";
import { AuthContext } from "../contexts/AuthProvider";
import LoadingSign from "../components/LoadingSign";
import CartContext from "../contexts/CartContext";

const AppLayout = () => {
  const { isLoading: cakeLoading } = useContext(CakeContext);
  const { isLoading: userLoading } = useContext(AuthContext);
  const { isLoading: cartLoading } = useContext(CartContext);

  const isLoading = cakeLoading || userLoading || cartLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flext-none">
        {isLoading ? <LoadingSign /> : <Navbar />}
      </div>
      <main className="flex-grow">
        {isLoading ? <LoadingSign /> : <Outlet />}
      </main>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
