import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function EditCustomerModal({ customer, onClose, onSave }) {
  // Validation schema (reuse from CustomerForm if possible)
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    customer_category: Yup.string().required("Category is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string().required("Mobile is required"),
    phone: Yup.string().nullable(),
    company_name: Yup.string().nullable(),
    credit_limit: Yup.number().required("Credit Limit is required"),
    credit_period: Yup.number().required("Credit Period is required"),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white border border-gray-200 p-6 w-96 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>

        <Formik
          initialValues={{ ...customer }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onSave(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <Field as="select" name="title" className="w-full border p-2 text-sm">
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </Field>
              <ErrorMessage name="title" component="div" className="text-red-500 text-xs" />

              <Field type="text" name="first_name" placeholder="First Name" className="w-full border p-2 text-sm" />
              <ErrorMessage name="first_name" component="div" className="text-red-500 text-xs" />

              <Field type="text" name="last_name" placeholder="Last Name" className="w-full border p-2 text-sm" />
              <ErrorMessage name="last_name" component="div" className="text-red-500 text-xs" />

              <Field type="email" name="email" placeholder="Email" className="w-full border p-2 text-sm" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />

              <Field type="text" name="mobile" placeholder="Mobile" className="w-full border p-2 text-sm" />
              <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs" />

              <Field type="text" name="phone" placeholder="Phone (Optional)" className="w-full border p-2 text-sm" />

              <Field type="text" name="company_name" placeholder="Company" className="w-full border p-2 text-sm" />

              <Field type="number" name="credit_limit" placeholder="Credit Limit" className="w-full border p-2 text-sm" />
              <ErrorMessage name="credit_limit" component="div" className="text-red-500 text-xs" />

              <Field type="number" name="credit_period" placeholder="Credit Period (days)" className="w-full border p-2 text-sm" />
              <ErrorMessage name="credit_period" component="div" className="text-red-500 text-xs" />

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-gray-200 text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
