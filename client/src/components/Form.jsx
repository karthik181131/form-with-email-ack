import React, { useState } from "react";
import axios from "axios";
import emailValidator from "email-validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const mobileRegex = /^[1-9][0-9]{9}$/;

function Form () {
  const [form, setForm] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0],
    programme: "",
    rollNumber: "",
    branch: "",
    personalEmail: "",
    mobile: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    declaration: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let err = "";
    if (name === "mobile") {
      if (!mobileRegex.test(value)) {
        err = "Enter a valid 10-digit mobile number.";
      }
    }
    if (name === "emergencyContactPhone") {
      if (!mobileRegex.test(value)) {
        err = "Enter a valid 10-digit phone number.";
      } else if (value === form.mobile && value !== "") {
        err = "Emergency contact number should be different from your mobile number.";
      }
    }
    if (name === "personalEmail") {
      if (!emailValidator.validate(value)) {
        err = "Enter a valid email address.";
      }
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleRadioChange = (e) => {
    setForm((prev) => ({ ...prev, programme: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setIsSubmitting(true);

    const errors = {};
    if (!form.name) errors.name = "Name is required.";
    if (!form.programme) errors.programme = "Programme is required.";
    if (!form.branch) errors.branch = "Department/Field is required.";
    if (!form.personalEmail) {
      errors.personalEmail = "Email is required.";
    } else if (!emailValidator.validate(form.personalEmail)) {
      errors.personalEmail = "Enter a valid email address.";
    }
    if (!form.mobile) {
      errors.mobile = "Phone number is required.";
    } else if (!mobileRegex.test(form.mobile)) {
      errors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!form.emergencyContactName) errors.emergencyContactName = "Emergency contact is required.";
    if (!form.emergencyContactPhone) {
      errors.emergencyContactPhone = "Emergency phone is required.";
    } else if (!mobileRegex.test(form.emergencyContactPhone)) {
      errors.emergencyContactPhone = "Enter a valid 10-digit phone number.";
    } else if (form.emergencyContactPhone === form.mobile) {
      errors.emergencyContactPhone = "Emergency contact number should be different from your mobile number.";
    }
    if (!form.declaration) errors.declaration = "You must agree to the declaration.";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/submit-form", form);
      setSubmitted(true);
      toast.success("Form submitted successfully! Please check your email.");
      setForm({
        name: "",
        date: new Date().toISOString().split('T')[0],
        programme: "",
        rollNumber: "",
        branch: "",
        personalEmail: "",
        mobile: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        declaration: false,
      });
      setFormErrors({});
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setFormErrors(prev => ({ ...prev, personalEmail: "Email is already registered." }));
        toast.error("Email is already registered. Please use a different email.");
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
      console.error("Submit error:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 16px 64px 16px rgba(0,0,0,0.22)', padding: '32px 18px' }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {submitted && (
        <div className="success-message">
          <strong>✅ Registration Successful!</strong> Please check your email for confirmation.
        </div>
      )}
      <form className={`i-form ${isSubmitting ? 'loading' : ''}`} onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-row">
          <label htmlFor="name">Full Name</label>
          <div style={{ flex: 1 }}>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe"
              style={{ borderColor: formErrors.name ? '#dc2626' : undefined, backgroundColor: formErrors.name ? '#fef2f2' : undefined }}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>
        </div>
        {/* Date */}
        <div className="form-row">
          <label htmlFor="date">Registration Date</label>
          <div style={{ flex: 1 }}>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              style={{ minWidth: 0 }}
            />
          </div>
        </div>
        {/* Programme */}
        <div className="form-row">
          <label htmlFor="programme">Programme</label>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'nowrap', alignItems: 'center', minWidth: 0, overflowX: 'auto', width: '100%' }}>
            {["BTech", "MTech", "PhD"].map((prog) => (
              <label
                key={prog}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#1a237e',
                  userSelect: 'none',
                  marginRight: 0,
                  marginBottom: 0,
                  whiteSpace: 'nowrap',
                }}
                htmlFor={`programme-${prog}`}
              >
                <input
                  id={`programme-${prog}`}
                  type="radio"
                  name="programme"
                  value={prog}
                  checked={form.programme === prog}
                  onChange={handleRadioChange}
                  required
                  style={{ accentColor: '#667eea', width: 18, height: 18 }}
                />
                {prog}
              </label>
            ))}
          </div>
          {formErrors.programme && <span className="error-message">{formErrors.programme}</span>}
        </div>
        {/* Roll Number */}
        <div className="form-row">
          <label htmlFor="rollNumber">Roll Number</label>
          <div style={{ flex: 1 }}>
            <input
              id="rollNumber"
              type="text"
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              placeholder="e.g. 123456 (optional)"
              style={{ minWidth: 0 }}
            />
          </div>
        </div>
        {/* Department/Field */}
        <div className="form-row">
          <label htmlFor="branch">Department/Field</label>
          <div style={{ flex: 1 }}>
            <input
              id="branch"
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
              placeholder="e.g. Computer Science"
              style={{ borderColor: formErrors.branch ? '#dc2626' : undefined, backgroundColor: formErrors.branch ? '#fef2f2' : undefined, minWidth: 0 }}
            />
            {formErrors.branch && <span className="error-message">{formErrors.branch}</span>}
          </div>
        </div>
        {/* Email */}
        <div className="form-row">
          <label htmlFor="personalEmail">Email Address</label>
          <div style={{ flex: 1 }}>
            <input
              id="personalEmail"
              type="email"
              name="personalEmail"
              value={form.personalEmail}
              onChange={handleChange}
              required
              placeholder="e.g. johndoe@email.com"
              style={{ borderColor: formErrors.personalEmail ? '#dc2626' : undefined, backgroundColor: formErrors.personalEmail ? '#fef2f2' : undefined, minWidth: 0 }}
            />
            {formErrors.personalEmail && <span className="error-message">{formErrors.personalEmail}</span>}
          </div>
        </div>
        {/* Phone Number */}
        <div className="form-row">
          <label htmlFor="mobile">Phone Number</label>
          <div style={{ flex: 1 }}>
            <input
              id="mobile"
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              placeholder="e.g. 9876543210"
              style={{ borderColor: formErrors.mobile ? '#dc2626' : undefined, backgroundColor: formErrors.mobile ? '#fef2f2' : undefined, minWidth: 0 }}
            />
            {formErrors.mobile && <span className="error-message">{formErrors.mobile}</span>}
          </div>
        </div>
        {/* Emergency Contact */}
        <div className="form-row">
          <label htmlFor="emergencyContactName">Emergency Contact</label>
          <div style={{ flex: 1 }}>
            <input
              id="emergencyContactName"
              type="text"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
              required
              placeholder="e.g. Jane Doe"
              style={{ borderColor: formErrors.emergencyContactName ? '#dc2626' : undefined, backgroundColor: formErrors.emergencyContactName ? '#fef2f2' : undefined, minWidth: 0 }}
            />
            {formErrors.emergencyContactName && <span className="error-message">{formErrors.emergencyContactName}</span>}
          </div>
        </div>
        {/* Emergency Phone */}
        <div className="form-row">
          <label htmlFor="emergencyContactPhone">Emergency Phone</label>
          <div style={{ flex: 1 }}>
            <input
              id="emergencyContactPhone"
              type="text"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
              required
              placeholder="e.g. 9876543211"
              style={{ borderColor: formErrors.emergencyContactPhone ? '#dc2626' : undefined, backgroundColor: formErrors.emergencyContactPhone ? '#fef2f2' : undefined, minWidth: 0 }}
            />
            {formErrors.emergencyContactPhone && <span className="error-message">{formErrors.emergencyContactPhone}</span>}
          </div>
        </div>
        {/* Declaration */}
        <div className="declaration-row">
          <input
            id="declaration"
            type="checkbox"
            checked={form.declaration || false}
            onChange={e => setForm(prev => ({ ...prev, declaration: e.target.checked }))}
            required
          />
          <label htmlFor="declaration" className="declaration-text">
            I agree to the terms and conditions and confirm that all information provided is accurate and complete. I understand that this information will be used for registration purposes.
          </label>
          {formErrors.declaration && <span className="error-message">{formErrors.declaration}</span>}
        </div>
        <button 
          type="submit" 
          className="submit-button"
          disabled={!form.declaration || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span style={{ marginRight: '8px' }}>⏳</span>
              Submitting...
            </>
          ) : (
            <>
              <span style={{ marginRight: '8px' }}>📝</span>
              Submit Registration
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
