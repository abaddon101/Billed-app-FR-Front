import LoginUI from "../views/LoginUI.js";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import DashboardUI from "../views/DashboardUI.js";

export const ROUTES_PATH = {
  Login: "/",
  Bills: "#employee/bills",
  NewBill: "#employee/bill/new",
  Dashboard: "#admin/dashboard",
};

export const ROUTES = ({ pathname, data, error, loading }) => {
  console.log("Navigating to path:", pathname);

  switch (pathname) {
    case ROUTES_PATH["Login"]:
      console.log("Rendering LoginUI");
      return LoginUI({ data, error, loading });
    case ROUTES_PATH["Bills"]:
      console.log("Rendering BillsUI");
      return BillsUI({ data, error, loading });
    case ROUTES_PATH["NewBill"]:
      console.log("Rendering NewBillUI");
      return NewBillUI();
    case ROUTES_PATH["Dashboard"]:
      console.log("Rendering DashboardUI");
      return DashboardUI({ data, error, loading });
    default:
      console.log("Unknown path. Rendering LoginUI");
      return LoginUI({ data, error, loading });
  }
};
