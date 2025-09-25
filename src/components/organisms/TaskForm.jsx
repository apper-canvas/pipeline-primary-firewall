import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { toast } from "react-toastify";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const TaskForm = ({ task, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    contactId: "",
    dealId: "",
  });

  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    loadContacts();
    loadDeals();
    
    if (task) {
setFormData({
        title: task.title_c || "",
        description: task.description_c || "",
        dueDate: task.due_date_c ? task.due_date_c.split("T")[0] : "",
        priority: task.priority_c || "medium",
        status: task.status_c || "pending",
        contactId: task.contact_id_c?.Id || task.contact_id_c || "",
        dealId: task.deal_id_c?.Id || task.deal_id_c || "",
      });
    }
  }, [task]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  };

  const loadDeals = async () => {
    try {
      const dealsData = await dealService.getAll();
      setDeals(dealsData);
    } catch (error) {
      console.error("Failed to load deals:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
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
      toast.success(task ? "Task updated successfully!" : "Task created successfully!");
      onCancel();
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
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
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter task title"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter task description (optional)"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          {priorities.map(priority => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Related Contact (Optional)"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
        >
          <option value="">Select a contact</option>
{contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.first_name_c} {contact.last_name_c} - {contact.company_c}
            </option>
          ))}
        </Select>

        <Select
          label="Related Deal (Optional)"
          name="dealId"
          value={formData.dealId}
          onChange={handleChange}
        >
          <option value="">Select a deal</option>
{deals.map(deal => (
            <option key={deal.Id} value={deal.Id}>
              {deal.title_c}
            </option>
          ))}
        </Select>
      </div>

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
          {isSubmitting ? "Saving..." : (task ? "Update Task" : "Create Task")}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;