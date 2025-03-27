import Switch, { switchClasses } from "@mui/joy/Switch";
import PropTypes from "prop-types";

export default function SwitchButton({
  type,
  checked,
  setChecked,
  handlePaymentUpdate,
  handleStatusUpdate,
  disabled,
}) {
  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={(event) => {
        setChecked(event.target.checked);
        if (type === "payment") handlePaymentUpdate(event.target.checked);
        if (type === "status") handleStatusUpdate(event.target.checked);
      }}
      sx={(theme) => ({
        "--Switch-thumbShadow": "0 3px 7px 0 rgba(0 0 0 / 0.12)",
        "--Switch-thumbSize": "27px",
        "--Switch-trackWidth": "51px",
        "--Switch-trackHeight": "31px",
        "--Switch-trackBackground": theme.vars.palette.background.level3,
        [`& .${switchClasses.thumb}`]: {
          transition: "width 0.2s, left 0.2s",
        },
        "&:hover": {
          "--Switch-trackBackground": theme.vars.palette.background.level3,
        },
        "&:active": {
          "--Switch-thumbWidth": "32px",
        },
        [`&.${switchClasses.checked}`]: {
          "--Switch-trackBackground": "rgb(48 209 88)",
          "&:hover": {
            "--Switch-trackBackground": "rgb(48 209 88)",
          },
        },
      })}
    />
  );
}

SwitchButton.propTypes = {
  type: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  handlePaymentUpdate: PropTypes.func.isRequired,
  handleStatusUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
