import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { FaRegRegistered } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import CartContext from "../contexts/CartContext";
import { FiShoppingBag } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { Typography } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { TbDatabaseEdit } from "react-icons/tb";
import { MdManageAccounts } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import OrderContext from "../contexts/OrderProvider";
import { useMediaQuery } from "@mui/system";

const authenticatedMenuItems = [
  {
    label: "Orders",
    icon: <FiShoppingBag className="h-5 w-5" />,
    linkTo: "/orders",
  },
  {
    label: "Profile",
    icon: <ImProfile className="h-5 w-5" />,
    linkTo: "/profile",
  },
  { type: "divider" },
  { label: "Logout", icon: <Logout className="h-5 w-5" />, linkTo: "/login" },
];

const unauthenticatedMenuItems = [
  {
    label: "Register",
    icon: <FaRegRegistered className="h-5 w-5" />,
    linkTo: "/register",
  },
  { label: "Login", icon: <IoLogIn className="h-5 w-5" />, linkTo: "/login" },
];

const adminMenuItems = [
  {
    label: "Add Cake",
    icon: <IoMdAdd className="h-5 w-5" />,
    linkTo: "/add-cake",
  },
  {
    label: "Manage Cake",
    icon: <TbDatabaseEdit className="h-5 w-5" />,
    linkTo: "/manage-cake",
  },
  {
    label: "Customer Orders",
    icon: <RiMoneyDollarCircleLine className="h-5 w-5" />,
    linkTo: "/customer-orders",
  },
  {
    label: "Manage User",
    icon: <MdManageAccounts className="h-5 w-5" />,
    linkTo: "/manage-user",
  },
];

const AccountMenu = ({
  accountMenuOpen,
  anchorEl,
  handleAccountMenuClose,
  orders,
}) => {
  const useAuth = useContext(AuthContext);
  const { setUser, user, setJwt, isAuthenticated, setIsAuthenticated } =
    useAuth;
  const { setCarts } = useContext(CartContext);
  const { setOrders } = useContext(OrderContext);
  const navigate = useNavigate();

  let menuItems = isAuthenticated
    ? [...authenticatedMenuItems]
    : unauthenticatedMenuItems;

  if (isAuthenticated && user.role === "admin") {
    menuItems = [...adminMenuItems, ...menuItems];
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setJwt(null);
    setCarts([]);
    setOrders([]);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const isSmallScreen = useMediaQuery("(max-width:640px)");
  const isAdmin = user?.role === "admin";
  const adminOrders = orders.filter((o) => o.userId === user.id);

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={accountMenuOpen}
      onClose={handleAccountMenuClose}
      onClick={handleAccountMenuClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: isSmallScreen ? 0 : 1.5,
            width: isAdmin ? 240 : 200,
            "& .MuiMenu-list": {
              padding: 1,
            },
            backgroundColor: "grey.100",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: isSmallScreen ? "auto" : 0,
              bottom: isSmallScreen ? "-10px" : "auto",
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "grey.100",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{
        horizontal: "right",
        vertical: isSmallScreen ? "bottom" : "top",
      }}
      anchorOrigin={{
        horizontal: "right",
        vertical: isSmallScreen ? "top" : "bottom",
      }}
    >
      {menuItems.map((item, index) =>
        item.type === "divider" ? (
          <Divider key={index} />
        ) : item.label === "Logout" ? (
          <MenuItem key={index} onClick={handleLogout}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography>{item.label}</Typography>
          </MenuItem>
        ) : item.label === "Orders" ? (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(item.linkTo);
              handleAccountMenuClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography>{item.label}</Typography>
            {(isAdmin ? adminOrders.length > 0 : orders.length > 0) && (
              <Box
                sx={{
                  ml: "auto",
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                }}
              >
                {isAdmin ? adminOrders.length : orders.length}
              </Box>
            )}
          </MenuItem>
        ) : item.label === "Customer Orders" ? (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(item.linkTo);
              handleAccountMenuClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography>{item.label}</Typography>
            {orders.length > 0 && (
              <Box
                sx={{
                  ml: "auto",
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                }}
              >
                {orders.length}
              </Box>
            )}
          </MenuItem>
        ) : (
          <MenuItem key={index} onClick={() => navigate(item.linkTo)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography>{item.label}</Typography>
          </MenuItem>
        ),
      )}
    </Menu>
  );
};

AccountMenu.propTypes = {
  accountMenuOpen: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  handleAccountMenuClose: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
};

export default AccountMenu;
