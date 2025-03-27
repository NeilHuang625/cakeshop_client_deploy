import { FaFilter } from "react-icons/fa";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { BsCake2 } from "react-icons/bs";
import { GiCupcake } from "react-icons/gi";
import { RiDiscountPercentLine } from "react-icons/ri";
import PropTypes from "prop-types";

function FilterDrawer({ handleCategoryChange, categories }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <p className="m-5 text-sm font-semibold text-gray-700">Categories</p>
      <Divider />
      <List>
        <ListItem key="All" disablePadding>
          <ListItemButton
            sx={{ display: "flex", gap: 2 }}
            onClick={() => handleCategoryChange({ target: { value: "All" } })}
          >
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <BsCake2 fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="All"
              slotProps={{ primary: { fontSize: "0.875rem" } }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem key="Specials" disablePadding>
          <ListItemButton
            sx={{ display: "flex", gap: 2 }}
            onClick={() =>
              handleCategoryChange({ target: { value: "Specials" } })
            }
          >
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <RiDiscountPercentLine fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Specials"
              slotProps={{ primary: { fontSize: "0.875rem" } }}
            />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              sx={{ display: "flex", gap: 2 }}
              onClick={() =>
                handleCategoryChange({ target: { value: category.id } })
              }
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <GiCupcake fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={category.categoryName}
                slotProps={{ primary: { fontSize: "0.875rem" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <button
        className="flex items-center gap-1 rounded-sm border border-gray-200 bg-gray-100 px-2 py-1 text-sm font-medium active:bg-gray-200"
        onClick={toggleDrawer(true)}
      >
        <FaFilter />
        Filters
      </button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

FilterDrawer.propTypes = {
  handleCategoryChange: PropTypes.func,
  categories: PropTypes.array,
};

export default FilterDrawer;
