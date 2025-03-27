import * as React from "react";
import Snackbar from "@mui/joy/Snackbar";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import PropTypes from "prop-types";

export default function MUIPopup({ open, setOpen, title, message }) {
  return (
    <React.Fragment>
      <Snackbar
        autoHideDuration={5000}
        variant="plain"
        color="primary"
        size="lg"
        invertedColors
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={(theme) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%})`,
          maxWidth: 360,
          borderRadius: 18,
        })}
      >
        <div>
          <Typography level="title-lg">{title}</Typography>
          <Typography sx={{ mt: 1, mb: 2 }}>{message}</Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              variant="soft"
              color="primary"
              onClick={() => setOpen(false)}
            >
              Ok
            </Button>
          </Stack>
        </div>
      </Snackbar>
    </React.Fragment>
  );
}

MUIPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
