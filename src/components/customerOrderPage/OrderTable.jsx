import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import { MdOutlinePending } from "react-icons/md";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
export default function OrderTable({
  currentOrders,
  usersWithOrders,
  totalPages,
  indexOfFirstOrder,
  currentPage,
  setCurrentPage,
  setSearchTerm,
  setOrderStatusFilter,
  setPaymentStatusFilter,
  setCustomerFilter,
  order,
  setOrder,
}) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const renderFilters = () => (
    <>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          onChange={(e, value) => setOrderStatusFilter(value)}
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="">All</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Payment</FormLabel>
        <Select
          onChange={(e, value) => setPaymentStatusFilter(value)}
          size="sm"
          placeholder="Filter by payment"
        >
          <Option value="">All</Option>
          <Option value="paid">Paid</Option>
          <Option value="unpaid">Unpaid</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Customer</FormLabel>
        <Select
          onChange={(e, value) => setCustomerFilter(value)}
          size="sm"
          placeholder="All"
        >
          <Option value="">All</Option>
          {usersWithOrders.map((u) => (
            <Option key={u.id} value={u.username}>
              {u.username}
            </Option>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for order</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                No.
              </th>
              <th style={{ width: 200, padding: "12px 6px" }}>Order #</th>
              <th style={{ width: 150, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: "lg",
                      "& svg": {
                        transition: "0.2s",
                        transform:
                          order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                      },
                    },
                    order === "desc"
                      ? { "& svg": { transform: "rotate(0deg)" } }
                      : { "& svg": { transform: "rotate(180deg)" } },
                  ]}
                >
                  Date
                </Link>
              </th>
              <th style={{ width: 100, padding: "12px 6px" }}>Status</th>
              <th style={{ width: 100, padding: "12px 6px" }}>Payment</th>
              <th style={{ width: 180, padding: "12px 6px" }}>Customer</th>
              <th style={{ width: 50, padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {[...currentOrders]
              .sort(getComparator(order, "date"))
              .map((row, index) => (
                <tr key={row.id}>
                  <td style={{ textAlign: "center", width: 120 }}>
                    <Typography level="body-xs">
                      {indexOfFirstOrder + index + 1}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.id}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.date}</Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        {
                          Confirmed: <CheckRoundedIcon />,
                          Completed: <CheckRoundedIcon />,
                          Pending: <MdOutlinePending className="h-3.5 w-3.5" />,
                        }[row.orderStatus]
                      }
                      color={
                        {
                          Confirmed: "success",
                          Completed: "success",
                          Pending: "danger",
                        }[row.orderStatus]
                      }
                    >
                      {row.orderStatus}
                    </Chip>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        {
                          true: <CheckRoundedIcon />,
                          false: <BlockIcon />,
                        }[row.paymentStatus]
                      }
                      color={
                        {
                          true: "success",
                          false: "danger",
                        }[row.paymentStatus]
                      }
                    >
                      {row.paymentStatus ? "Paid" : "Unpaid"}
                    </Chip>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar size="sm">{row.customer.initial}</Avatar>
                      <div>
                        <Typography level="body-xs">
                          {row.customer.name}
                        </Typography>
                        <Typography level="body-xs">
                          {row.customer.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Link
                        level="body-xs"
                        component="button"
                        onClick={() => navigate(`/customer-orders/${row.id}`)}
                      >
                        View
                      </Link>
                    </Box>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={page === currentPage ? "outlined" : "plain"}
            color="neutral"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </>
  );
}

OrderTable.propTypes = {
  currentOrders: PropTypes.array.isRequired,
  usersWithOrders: PropTypes.array.isRequired,
  totalPages: PropTypes.number.isRequired,
  indexOfFirstOrder: PropTypes.number.isRequired,
  ordersPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setOrderStatusFilter: PropTypes.func.isRequired,
  setPaymentStatusFilter: PropTypes.func.isRequired,
  setCustomerFilter: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  setOrder: PropTypes.func.isRequired,
  setSelectedOrderId: PropTypes.func.isRequired,
};
