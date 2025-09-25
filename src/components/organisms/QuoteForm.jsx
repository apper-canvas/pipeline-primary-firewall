import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { toast } from "react-toastify";

const QuoteForm = ({ quote, contacts, deals, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    company_c: "",
    contact_id_c: "",
    deal_id_c: "",
    quote_date_c: "",
    status_c: "Draft",
    delivery_method_c: "Email",
    expires_on_c: "",
    billing_name_c: "",
    billing_street_c: "",
    billing_city_c: "",
    billing_state_c: "",
    billing_country_c: "",
    billing_pincode_c: "",
    shipping_name_c: "",
    shipping_street_c: "",
    shipping_city_c: "",
    shipping_state_c: "",
    shipping_country_c: "",
    shipping_pincode_c: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" },
  ];

  const deliveryOptions = [
    { value: "Email", label: "Email" },
    { value: "Mail", label: "Mail" },
    { value: "In Person", label: "In Person" },
  ];

  useEffect(() => {
    if (quote) {
      setFormData({
        company_c: quote.company_c || "",
        contact_id_c: quote.contact_id_c?.Id || quote.contact_id_c || "",
        deal_id_c: quote.deal_id_c?.Id || quote.deal_id_c || "",
        quote_date_c: quote.quote_date_c ? quote.quote_date_c.split("T")[0] : "",
        status_c: quote.status_c || "Draft",
        delivery_method_c: quote.delivery_method_c || "Email",
        expires_on_c: quote.expires_on_c ? quote.expires_on_c.split("T")[0] : "",
        billing_name_c: quote.billing_name_c || "",
        billing_street_c: quote.billing_street_c || "",
        billing_city_c: quote.billing_city_c || "",
        billing_state_c: quote.billing_state_c || "",
        billing_country_c: quote.billing_country_c || "",
        billing_pincode_c: quote.billing_pincode_c || "",
        shipping_name_c: quote.shipping_name_c || "",
        shipping_street_c: quote.shipping_street_c || "",
        shipping_city_c: quote.shipping_city_c || "",
        shipping_state_c: quote.shipping_state_c || "",
        shipping_country_c: quote.shipping_country_c || "",
        shipping_pincode_c: quote.shipping_pincode_c || "",
      });
    }
  }, [quote]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_c.trim()) {
      newErrors.company_c = "Company is required";
    }

    if (!formData.contact_id_c) {
      newErrors.contact_id_c = "Contact is required";
    }

    if (!formData.deal_id_c) {
      newErrors.deal_id_c = "Deal is required";
    }

    if (!formData.quote_date_c) {
      newErrors.quote_date_c = "Quote date is required";
    }

    if (!formData.expires_on_c) {
      newErrors.expires_on_c = "Expiration date is required";
    } else if (new Date(formData.expires_on_c) <= new Date(formData.quote_date_c)) {
      newErrors.expires_on_c = "Expiration date must be after quote date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onCancel();
    } catch (error) {
      toast.error("Failed to save quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping_name_c: prev.billing_name_c,
      shipping_street_c: prev.billing_street_c,
      shipping_city_c: prev.billing_city_c,
      shipping_state_c: prev.billing_state_c,
      shipping_country_c: prev.billing_country_c,
      shipping_pincode_c: prev.billing_pincode_c,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quote Details Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            name="company_c"
            value={formData.company_c}
            onChange={handleChange}
            error={errors.company_c}
            placeholder="Enter company name"
          />

          <Select
            label="Contact"
            name="contact_id_c"
            value={formData.contact_id_c}
            onChange={handleChange}
            error={errors.contact_id_c}
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.first_name_c} {contact.last_name_c} - {contact.company_c}
              </option>
            ))}
          </Select>

          <Select
            label="Deal"
            name="deal_id_c"
            value={formData.deal_id_c}
            onChange={handleChange}
            error={errors.deal_id_c}
          >
            <option value="">Select a deal</option>
            {deals.map(deal => (
              <option key={deal.Id} value={deal.Id}>
                {deal.title_c}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            name="status_c"
            value={formData.status_c}
            onChange={handleChange}
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>

          <Input
            label="Quote Date"
            name="quote_date_c"
            type="date"
            value={formData.quote_date_c}
            onChange={handleChange}
            error={errors.quote_date_c}
          />

          <Input
            label="Expires On"
            name="expires_on_c"
            type="date"
            value={formData.expires_on_c}
            onChange={handleChange}
            error={errors.expires_on_c}
          />

          <Select
            label="Delivery Method"
            name="delivery_method_c"
            value={formData.delivery_method_c}
            onChange={handleChange}
            className="md:col-span-2"
          >
            {deliveryOptions.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Billing Address Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bill To Name"
            name="billing_name_c"
            value={formData.billing_name_c}
            onChange={handleChange}
            placeholder="Enter billing name"
            className="md:col-span-2"
          />

          <Input
            label="Street Address"
            name="billing_street_c"
            value={formData.billing_street_c}
            onChange={handleChange}
            placeholder="Enter street address"
            className="md:col-span-2"
          />

          <Input
            label="City"
            name="billing_city_c"
            value={formData.billing_city_c}
            onChange={handleChange}
            placeholder="Enter city"
          />

          <Input
            label="State"
            name="billing_state_c"
            value={formData.billing_state_c}
            onChange={handleChange}
            placeholder="Enter state"
          />

          <Input
            label="Country"
            name="billing_country_c"
            value={formData.billing_country_c}
            onChange={handleChange}
            placeholder="Enter country"
          />

          <Input
            label="Pincode"
            name="billing_pincode_c"
            value={formData.billing_pincode_c}
            onChange={handleChange}
            placeholder="Enter pincode"
          />
        </div>
      </div>

      {/* Shipping Address Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={copyBillingToShipping}
          >
            Copy from Billing
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ship To Name"
            name="shipping_name_c"
            value={formData.shipping_name_c}
            onChange={handleChange}
            placeholder="Enter shipping name"
            className="md:col-span-2"
          />

          <Input
            label="Street Address"
            name="shipping_street_c"
            value={formData.shipping_street_c}
            onChange={handleChange}
            placeholder="Enter street address"
            className="md:col-span-2"
          />

          <Input
            label="City"
            name="shipping_city_c"
            value={formData.shipping_city_c}
            onChange={handleChange}
            placeholder="Enter city"
          />

          <Input
            label="State"
            name="shipping_state_c"
            value={formData.shipping_state_c}
            onChange={handleChange}
            placeholder="Enter state"
          />

          <Input
            label="Country"
            name="shipping_country_c"
            value={formData.shipping_country_c}
            onChange={handleChange}
            placeholder="Enter country"
          />

          <Input
            label="Pincode"
            name="shipping_pincode_c"
            value={formData.shipping_pincode_c}
            onChange={handleChange}
            placeholder="Enter pincode"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (quote ? "Update Quote" : "Create Quote")}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;