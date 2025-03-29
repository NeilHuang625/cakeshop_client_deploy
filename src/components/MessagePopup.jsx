import Box from "@mui/joy/Box";
import Snackbar from "@mui/joy/Snackbar";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

export default function MessagePopup({
  open,
  setOpen,
  message,
  vertical,
  horizontal,
  icon,
  color,
  buttonLabel,
  buttonAction,
}) {
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
        open={open}
        variant="soft"
        color={color}
        onClose={handleClose}
        startDecorator={icon}
        endDecorator={
          <Button
            onClick={buttonAction}
            size="sm"
            variant="outlined"
            color={color}
          >
            {buttonLabel}
          </Button>
        }
      >
        {message}
      </Snackbar>
    </Box>
  );
}

MessagePopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  message: PropTypes.string,
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
  icon: PropTypes.element,
  color: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonAction: PropTypes.func,
};
