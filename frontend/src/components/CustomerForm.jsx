import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// This is the App component that will contain all the logic and rendering.
const CustomerForm = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [allowedCities, setAllowedCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

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

  // Effect to fetch allowed cities when component mounts
  useEffect(() => {
    const fetchAllowedCities = async () => {
      setLoadingCities(true);
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setMessage("You must be logged in to add a customer.");
          setIsError(true);
          setLoadingCities(false);
          return;
        }

        // --- Start Workaround for fetching cities from existing endpoint ---
        // This makes a GET request to your customer list endpoint
        // and extracts unique cities from the returned customers.
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/cms/customers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const uniqueCities = [...new Set(response.data.map(customer => customer.city))];
        setAllowedCities(uniqueCities);
        // --- End Workaround ---

        // Ideal scenario would be a dedicated endpoint like:
        // const response = await axios.get("http://127.0.0.1:8000/cms/allowed-cities/", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setAllowedCities(response.data.cities); // Assuming response.data = { "cities": ["Colombo", "Kandy"] }

      } catch (error) {
        console.error("Failed to fetch allowed cities:", error.response?.data || error.message);
        setMessage("Failed to load available cities. Please try again.");
        setIsError(true);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchAllowedCities();
  }, []); // Run only once on mount

  // Define Yup validation schema - now dynamic for city
  // This schema is a function that returns the schema, so it can use allowedCities
  const getValidationSchema = (cities) => Yup.object().shape({
    title: Yup.string().required("Title is required"),
    customer_category: Yup.string().required("Customer category is required"),
    first_name: Yup.string().required("First Name is required").min(2, "First Name must be at least 2 characters"),
    last_name: Yup.string().required("Last Name is required").min(2, "Last Name must be at least 2 characters"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    address_1: Yup.string().required("Address 1 is required").min(5, "Address must be at least 5 characters"),
    address_2: Yup.string(), // Optional
    city: Yup.string()
      .required("City is required")
      .oneOf(cities, "Please select a valid city from the list"), // Dynamic validation
    mobile: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Mobile number is not valid")
      .required("Mobile is required"),
    phone: Yup.string().matches(/^[0-9]{10,15}$/, "Phone number is not valid").nullable(), // Optional, but validate if present
    company_name: Yup.string(), // Optional
    credit_limit: Yup.number()
      .typeError("Credit Limit must be a number")
      .min(0, "Credit Limit cannot be negative")
      .required("Credit Limit is required"),
    credit_period: Yup.number()
      .typeError("Credit Period must be a number")
      .integer("Credit Period must be an integer")
      .min(0, "Credit Period cannot be negative")
      .required("Credit Period is required"),
    photo: Yup.mixed().nullable(), // For file uploads, you might add more specific validation if needed
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessage(null);
    setIsError(false);

    try {
      const formDataToSend = new FormData();
      for (const key in values) {
        if (values[key] !== null && values[key] !== undefined && values[key] !== '') { // Only append if not empty
          if (key === 'credit_limit') {
            formDataToSend.append(key, parseFloat(values[key]));
          } else if (key === 'credit_period') {
            formDataToSend.append(key, parseInt(values[key], 10));
          } else {
            formDataToSend.append(key, values[key]);
          }
        }
      }
      
      const token = localStorage.getItem("access");
      if (!token) {
        setMessage("You must be logged in to add a customer.");
        setIsError(true);
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cms/customers/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        }
      );
      setMessage("Customer added successfully!");
      resetForm(); // Reset form after successful submission
      console.log(response.data);
      navigate("/dashboard");

    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("Failed to add customer. Please check your inputs.");
      setIsError(true);
    } finally {
      setSubmitting(false); // Re-enable the submit button
    }
  };

  // If cities are still loading, show a loading indicator
  if (loadingCities) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-gray-700 text-lg">Loading cities...</p>
      </div>
    );
  }

  // If no allowed cities were fetched, and it's not loading anymore, show an error
  if (!loadingCities && allowedCities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-red-600 text-lg">Could not load available cities. Please ensure you have permission or contact support.</p>
      </div>
    );
  }


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

        <Formik
          initialValues={{
            title: "",
            customer_category: "",
            first_name: "",
            last_name: "",
            email: "",
            address_1: "",
            address_2: "",
            city: "", // Keep city as an empty string initially
            mobile: "",
            phone: "",
            company_name: "",
            credit_limit: "",
            credit_period: "",
            photo: null,
          }}
          validationSchema={getValidationSchema(allowedCities)} // Pass allowedCities to the schema
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Title and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    as="select"
                    name="title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </Field>
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <Field
                    as="select"
                    name="customer_category"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select Category</option>
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                  </Field>
                  <ErrorMessage name="customer_category" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    type="text"
                    name="address_1"
                    placeholder="Address 1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="address_1" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="address_2"
                    placeholder="Address 2 (Optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="address_2" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* City dropdown */}
              <div>
                <Field
                  as="select"
                  name="city"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select City</option>
                  {allowedCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    type="text"
                    name="mobile"
                    placeholder="Mobile"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone (Optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              {/* Company and Credit */}
              <div>
                <Field
                  type="text"
                  name="company_name"
                  placeholder="Company Name (Optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <ErrorMessage name="company_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    type="number"
                    name="credit_limit"
                    placeholder="Credit Limit"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="credit_limit" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="number"
                    name="credit_period"
                    placeholder="Credit Period (days)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <ErrorMessage name="credit_period" component="div" className="text-red-500 text-sm mt-1" />
                </div>
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
                  onChange={(event) => {
                    setFieldValue("photo", event.currentTarget.files[0]);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <ErrorMessage name="photo" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loadingCities} // Disable if still loading cities
                className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding Customer..." : "Add Customer"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CustomerForm;