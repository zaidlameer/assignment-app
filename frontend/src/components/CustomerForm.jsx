import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// This is the App component that will contain all the logic and rendering.
const CustomerForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    customer_category: "",
    first_name: "",
    last_name: "",
    email: "",
    address_1: "",
    address_2: "",
    city: "",
    mobile: "",
    phone: "",
    company_name: "",
    credit_limit: "",
    credit_period: "",
    photo: null,
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // useEffect to clear the message after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setIsError(false);
      }, 5000); // Clear message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      // Use FormData to correctly send the file and other data
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          if (key === 'credit_limit') {
            formDataToSend.append(key, parseFloat(formData[key]));
          } else if (key === 'credit_period') {
            formDataToSend.append(key, parseInt(formData[key], 10));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }
      
      // gets token from local storage
      const token = localStorage.getItem("access");
      if (!token) {
        setMessage("You must be logged in to add a customer.");
        setIsError(true);
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/cms/customers/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      setMessage("Customer added successfully!");
      // Reset form after successful submission
      setFormData({
        title: "",
        customer_category: "",
        first_name: "",
        last_name: "",
        email: "",
        address_1: "",
        address_2: "",
        city: "",
        mobile: "",
        phone: "",
        company_name: "",
        credit_limit: "",
        credit_period: "",
        photo: null,
      });
      console.log(response.data);
      navigate("/dashboard");

    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("Failed to add customer. Please check your inputs.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Customer</h1>

        {/* Message Box */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 text-center font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="title"
              onChange={handleChange}
              value={formData.title}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>

            <select
              name="customer_category"
              onChange={handleChange}
              value={formData.customer_category}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select Category</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="address_1"
              placeholder="Address 1"
              onChange={handleChange}
              value={formData.address_1}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="text"
              name="address_2"
              placeholder="Address 2 (Optional)"
              onChange={handleChange}
              value={formData.address_2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            value={formData.city}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              onChange={handleChange}
              value={formData.mobile}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone (Optional)"
              onChange={handleChange}
              value={formData.phone}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Company and Credit */}
          <input
            type="text"
            name="company_name"
            placeholder="Company Name (Optional)"
            onChange={handleChange}
            value={formData.company_name}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="credit_limit"
              placeholder="Credit Limit"
              onChange={handleChange}
              value={formData.credit_limit}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="number"
              name="credit_period"
              placeholder="Credit Period (days)"
              onChange={handleChange}
              value={formData.credit_period}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Photo
            </label>
            <input
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
