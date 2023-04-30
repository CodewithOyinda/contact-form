import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";

const submitFormData = async (values) => {
  const requestOptions = {
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await axios.post(
      "https://my-json-server.typicode.com/tundeojediran/contacts-api-server/inquiries",
      values,
      requestOptions
    );
    console.log(response, "my-data");
    // Return the response data
    return response.data;
  } catch (error) {
    // If there is an error, throw it
    throw error;
  }
};

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.message) {
    errors.message = "Required";
  }

  return errors;
};

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        await submitFormData(values);
        resetForm();
        setIsFormSubmitted(true);

        // Set a timer to hide the message after 3 seconds
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 3000);
      } catch (error) {
        console.log(error);
        setIsFormError(true);

        setFormErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="App">
      {isFormSubmitted && (
        <div
          style={{
            backgroundColor: "green",
            color: "white",
            padding: 10,
          }}
        >
          Thank you for your submission!
        </div>
      )}

      {isFormError && (
        <div style={{ backgroundColor: "red", color: "white", padding: 10 }}>
          {formErrorMessage}
        </div>
      )}

      <h1>Contact Us</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Full name"
            {...formik.getFieldProps("name")}
          />
          {formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            {...formik.getFieldProps("email")}
          />
          {formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Enter your message here"
            {...formik.getFieldProps("subject")}
          />
        </div>
        <div className="form-control">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Message"
            {...formik.getFieldProps("message")}
            rows={5}
            cols={60}
          />
          {formik.errors.message && (
            <div className="error">{formik.errors.message}</div>
          )}
        </div>
        <button type="submit">
          {" "}
          {isLoading ? <div className="loader"></div> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
