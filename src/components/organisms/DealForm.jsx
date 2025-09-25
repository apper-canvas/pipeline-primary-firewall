import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { toast } from "react-toastify";
import contactService from "@/services/api/contactService";

const DealForm = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "lead",
    contactId: "",
    probability: "10",
    expectedCloseDate: "",
    description: "",
  });

  const [contacts, setContacts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" },
  ];

  useEffect(() => {
    loadContacts();
    
    if (deal) {
setFormData({
        title: deal.title_c || "",
        value: deal.value_c?.toString() || "",
        stage: deal.stage_c || "lead",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || "",
        probability: deal.probability_c?.toString() || "10",
        expectedCloseDate: deal.expected_close_date_c ? deal.expected_close_date_c.split("T")[0] : "",
        description: deal.description_c || "",
      });
    }
  }, [deal]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = "Deal value must be a positive number";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
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
      const dealData = {
        ...formData,
        value: Number(formData.value),
        probability: Number(formData.probability),
      };

      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully!" : "Deal created successfully!");
      onCancel();
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Deal Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter deal title"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deal Value ($)"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          placeholder="Enter deal value"
        />

        <Select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
        >
          {stages.map(stage => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          error={errors.contactId}
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
<option key={contact.Id} value={contact.Id}>
              {contact.first_name_c} {contact.last_name_c} - {contact.company_c}
            </option>
          ))}
        </Select>

        <Select
          label="Probability (%)"
          name="probability"
          value={formData.probability}
          onChange={handleChange}
        >
          <option value="10">10%</option>
          <option value="25">25%</option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="90">90%</option>
          <option value="100">100%</option>
        </Select>
      </div>

      <Input
        label="Expected Close Date"
        name="expectedCloseDate"
        type="date"
        value={formData.expectedCloseDate}
        onChange={handleChange}
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter deal description (optional)"
        rows={3}
      />

      <div className="flex justify-end space-x-3 pt-6">
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
          {isSubmitting ? "Saving..." : (deal ? "Update Deal" : "Create Deal")}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;