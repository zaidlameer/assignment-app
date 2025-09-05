import CustomerList from "../components/CustomerList";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Header with Add Customer button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button onClick={() => navigate("/addcustomer")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Customer
        </button>
      </div>

      {/* Customer List */}
      <CustomerList />
    </div>
  );
}
