import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import PropTypes from "prop-types";
import { MdOutlinePending } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export default function OrderList({
  currentOrders,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: { xs: "block", sm: "none" } }}>
      {currentOrders.map((listItem) => (
        <List key={listItem.id} size="sm" sx={{ "--ListItem-paddingX": 0 }}>
          <ListItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <ListItemContent
              sx={{ display: "flex", gap: 2, alignItems: "start" }}
            >
              <ListItemDecorator>
                <Avatar size="sm">{listItem.customer.initial}</Avatar>
              </ListItemDecorator>
              <div>
                <Typography gutterBottom sx={{ fontWeight: 600 }}>
                  {listItem.customer.name}
                </Typography>
                <Typography level="body-xs" gutterBottom>
                  {listItem.customer.email}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",

                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography level="body-xs"># {listItem.id}</Typography>
                  <Typography level="body-xs">{listItem.date}</Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Link
                    level="body-sm"
                    component="button"
                    onClick={() => navigate(`/customer-orders/${listItem.id}`)}
                  >
                    View
                  </Link>
                </Box>
              </div>
            </ListItemContent>
            <Chip
              variant="soft"
              size="sm"
              startDecorator={
                {
                  Confirmed: <CheckRoundedIcon />,
                  Completed: <CheckRoundedIcon />,
                  Pending: <MdOutlinePending className="h-3.5 w-3.5" />,
                }[listItem.orderStatus]
              }
              color={
                {
                  Confirmed: "success",
                  Completed: "success",
                  Pending: "danger",
                }[listItem.orderStatus]
              }
            >
              {listItem.orderStatus}
            </Chip>
          </ListItem>
          <ListDivider />
        </List>
      ))}
      <Box
        className="Pagination-mobile"
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          py: 2,
        }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" sx={{ mx: "auto" }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

OrderList.propTypes = {
  currentOrders: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  ordersPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setSelectedOrderId: PropTypes.func.isRequired,
};
