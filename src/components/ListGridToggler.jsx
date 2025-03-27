import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PropTypes from "prop-types";

export default function ListGridToggler({ view, handleChange }) {
  return (
    <div className="hidden sm:block">
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleChange}
        size="small"
      >
        <ToggleButton value="grid" aria-label="grid">
          <ViewModuleIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="list" aria-label="list">
          <ViewListIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

ListGridToggler.propTypes = {
  view: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
