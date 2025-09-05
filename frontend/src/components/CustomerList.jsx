import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({});
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
  });

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
      const response = await axios.put(
        `http://127.0.0.1:8000/cms/customers/${editingCustomer.id}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(
        customers.map((c) => (c.id === editingCustomer.id ? response.data : c))
      );
      setEditingCustomer(null);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update customer.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Customers
        </h2>
        {customers.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">City</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Credit Limit</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Credit Period</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="py-3 px-4 text-gray-700">{customer.title}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{customer.email}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.city}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.mobile}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.company_name || "-"}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.credit_limit}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.credit_period} days</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:underline mr-3"
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

        {editingCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4">Edit Customer</h3>
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded p-2"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded p-2"
                  placeholder="Last Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded p-2"
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded p-2"
                  placeholder="City"
                  required
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
