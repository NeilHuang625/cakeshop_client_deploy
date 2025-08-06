import { Divider, IconButton, Switch } from "@mui/material";
import { useContext, useState } from "react";
import CakeContext from "../contexts/CakeContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import { deleteCake, updateCakeAvailability } from "../services/apiCake";
import { AuthContext } from "../contexts/AuthProvider";

const ManageCake = () => {
  const { cakes, setCakes } = useContext(CakeContext);
  const { jwt } = useContext(AuthContext);

  const [selectedCakeId, setSelectedCakeId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handleDelete = (cakeId) => {
    setOpenDialog(true);
    setSelectedCakeId(cakeId);
  };

  const handleAvailabilityToggle = async (cakeId, currentAvailability) => {
    const result = await updateCakeAvailability(cakeId, !currentAvailability, jwt);
    if (result.success) {
      setCakes((prev) => 
        prev.map((cake) => 
          cake.id === cakeId 
            ? { ...cake, isAvailable: !currentAvailability }
            : cake
        )
      );
    }
  };

  const action = async () => {
    if (!selectedCakeId) return;

    const result = await deleteCake(selectedCakeId, jwt);
    if (result.success) {
      setCakes((prev) => prev.filter((cake) => cake.id !== selectedCakeId));
    }
    setOpenDialog(false);
  };

  return (
    <div className="mx-auto mb-10 max-w-5xl px-2 py-1 sm:px-4 sm:py-3">
      <div className="mt-5 flex items-center justify-end">
        <button
          onClick={() => navigate("/add-cake")}
          className="my-3 rounded-full bg-amber-400 px-4 py-2 font-semibold text-gray-700 duration-200 hover:cursor-pointer hover:bg-amber-500 hover:text-white"
        >
          Add Cake
        </button>
      </div>
      <Divider className="mt-3" />
      <div className="mt-3">
        <ul className="space-y-4">
          {cakes.map((cake) => (
            <li
              key={cake.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={cake.cakeImages[0]}
                  alt={cake.cakeName}
                  className="h-16 w-16 rounded object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cake.cakeName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    NZ$ {cake.cakeOptions[0].price}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={cake.isAvailable}
                  onChange={() => handleAvailabilityToggle(cake.id, cake.isAvailable)}
                  color="primary"
                  size="small"
                />
                <IconButton
                  onClick={() => navigate(`/edit-cake/${cake.id}`)}
                  color="secondary"
                  aria-label="edit"
                  size="small"
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(cake.id)}
                  color="secondary"
                  aria-label="delete"
                  size="small"
                >
                  <FaTrashAlt />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AlertDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Delete Cake"
        actionName="Delete"
        action={action}
        message="Are you sure you want to delete this cake? All of your
                      data will be permanently removed. This action cannot be
                      undone."
      />
    </div>
  );
};

export default ManageCake;
