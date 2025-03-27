import Box from "@mui/joy/Box";
import Snackbar from "@mui/joy/Snackbar";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

export default function MessagePopup({
  open,
  setOpen,
  message,
  vertical,
  horizontal,
}) {
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
        open={open}
        variant="soft"
        color="success"
        onClose={handleClose}
        startDecorator={<CheckRoundedIcon />}
        endDecorator={
          <Button
            onClick={handleClose}
            size="sm"
            variant="soft"
            color="success"
          >
            Dismiss
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
};
