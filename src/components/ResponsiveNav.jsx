import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { Badge } from "@mui/material";
import PropTypes from "prop-types";

const ResponsiveMenu = ({ totalCartItems, toggleDrawer, onClick, orders }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollTop + windowHeight >= documentHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-10 transition-transform duration-500 ${
        isMobile && !isAtBottom ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Box sx={{ width: "100%", boxShadow: 6, bgcolor: "#fff" }}>
        <BottomNavigation showLabels sx={{ height: "80px" }}>
          <BottomNavigationAction
            onClick={toggleDrawer(true)}
            label="My Cart"
            icon={
              <Badge badgeContent={totalCartItems} color="error">
                <RiShoppingCartLine size="25px" />
              </Badge>
            }
            sx={{
              "& .MuiBottomNavigationAction-label": { fontSize: "0.7rem" },
            }}
          />
          <BottomNavigationAction
            onClick={onClick}
            label="Account"
            icon={
              <Badge
                badgeContent={orders.length}
                color="primary"
                variant="dot"
                invisible={orders.length === 0}
              >
                <MdAccountCircle size="25px" />
              </Badge>
            }
            sx={{
              "& .MuiBottomNavigationAction-label": { fontSize: "0.7rem" },
            }}
          />
        </BottomNavigation>
      </Box>
    </div>
  );
};

ResponsiveMenu.propTypes = {
  totalCartItems: PropTypes.number.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
};

export default ResponsiveMenu;
