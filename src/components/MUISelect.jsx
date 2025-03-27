import * as React from "react";
import PropTypes from "prop-types";
import { Select as BaseSelect, selectClasses } from "@mui/base/Select";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { styled } from "@mui/system";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import { CssTransition } from "@mui/base/Transitions";
import { PopupContext } from "@mui/base/Unstable_Popup";
import { amber, blue, grey } from "@mui/material/colors";

export default function MUISelect({ options, onChange, type, width }) {
  if (type === "objectOption") {
    return (
      <Select defaultValue={options[0].id} onChange={onChange} width={width}>
        {options.map((option) => (
          <Option key={option.id} value={option.id}>
            {option.name}: ${option.price}
          </Option>
        ))}
      </Select>
    );
  }
  if (type === "stringOption") {
    return (
      <Select defaultValue={options[0].name} onChange={onChange} width={width}>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.name}
          </Option>
        ))}
      </Select>
    );
  }
}

MUISelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  width: PropTypes.string,
};

const Select = React.forwardRef(function CustomSelect(
  { width, ...props },
  ref,
) {
  const slots = {
    root: (props) => <StyledButton {...props} width={width} />,
    listbox: AnimatedListbox,
    popup: Popup,
    ...props.slots,
  };

  return (
    <BaseSelect
      {...props}
      ref={ref}
      slots={slots}
      slotProps={{ popup: { disablePortal: true, container: document.body } }}
    />
  );
});

Select.propTypes = {
  /**
   * The components used for each slot inside the Select.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  width: PropTypes.string,
  slots: PropTypes.shape({
    listbox: PropTypes.elementType,
    popup: PropTypes.elementType,
    root: PropTypes.elementType,
  }),
};

const Button = React.forwardRef(function Button(props, ref) {
  // eslint-disable-next-line no-unused-vars
  const { ownerState, ...other } = props;
  return (
    <button type="button" {...other} ref={ref}>
      {other.children}
      <UnfoldMoreRoundedIcon />
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node,
  ownerState: PropTypes.object,
};

const StyledButton = styled(Button, { shouldForwardProp: () => true })(
  ({ theme, width }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  // min-width: 200px;
  width: ${width ? width : "200px"};
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
  line-height: 1.5;
  background: ${theme.palette.mode === "dark" ? grey[500] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  position: relative;
  box-shadow: 0 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : amber[300]};
    cursor: pointer;
  }

  &.${selectClasses.focusVisible} {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[700] : blue[200]};
  }

  & > svg {
    font-size: 1rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `,
);

const Listbox = styled("ul")(
  ({ theme, width }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  width: ${width ? width : "200px"};
  border-radius: 12px;
  overflow: auto;
  outline: 0;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  
  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `,
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
  const { ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      "The `AnimatedListbox` component cannot be rendered outside a `Popup` component",
    );
  }

  const verticalPlacement = popupContext.placement.split("-")[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

const Option = styled(BaseOption)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : amber[600]};
    color: ${theme.palette.mode === "dark" ? blue[100] : amber[600]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : amber[600]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &:focus-visible {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : amber[600]};
  }
  
  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : amber[600]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : amber[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : amber[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : amber[900]};
  }
  `,
);

const Popup = styled("div")`
  z-index: 1;
`;
