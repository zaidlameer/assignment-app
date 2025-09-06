import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [formData, setFormData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const fetchCustomers = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/cms/customers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/cms/customers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete customer.");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (addingCustomer) {
        const response = await axios.post(
          `http://127.0.0.1:8000/cms/customers/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers([...customers, response.data]);
        setAddingCustomer(false);
      } else {
        const response = await axios.put(
          `http://127.0.0.1:8000/cms/customers/${editingCustomer.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers(
          customers.map((c) => (c.id === editingCustomer.id ? response.data : c))
        );
        setEditingCustomer(null);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to save customer.");
    }
  };

  // Sorting logic
  const sortedCustomers = React.useMemo(() => {
    let sortable = [...customers];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [customers, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customers</h2>
          <button
            onClick={() => {
              navigate('/addcustomer');
            }}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            + Add Customer
          </button>
        </div>
        {sortedCustomers.length === 0 ? (
          <p className="text-center text-gray-600">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  {[
                    ["title", "Title"],
                    ["first_name", "Name"],
                    ["email", "Email"],
                    ["city", "City"],
                    ["mobile", "Mobile"],
                    ["company_name", "Company"],
                    ["credit_limit", "Credit Limit"],
                    ["credit_period", "Credit Period"],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="py-2 px-3 text-left font-medium text-gray-700 cursor-pointer select-none"
                    >
                      {label}
                      {renderSortArrow(key)}
                    </th>
                  ))}
                  <th className="py-2 px-3 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-2 px-3">{customer.title}</td>
                    <td className="py-2 px-3">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="py-2 px-3">{customer.email}</td>
                    <td className="py-2 px-3">{customer.city}</td>
                    <td className="py-2 px-3">{customer.mobile}</td>
                    <td className="py-2 px-3">{customer.company_name || "-"}</td>
                    <td className="py-2 px-3">{customer.credit_limit}</td>
                    <td className="py-2 px-3">{customer.credit_period} days</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(editingCustomer || addingCustomer) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white border border-gray-200 p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">
                {addingCustomer ? "Add Customer" : "Edit Customer"}
              </h3>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 text-sm"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 text-sm"
                  placeholder="Last Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 text-sm"
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 text-sm"
                  placeholder="City"
                  required
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCustomer(null);
                      setAddingCustomer(false);
                    }}
                    className="px-3 py-1.5 bg-gray-200 text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
