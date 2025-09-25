import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ContactForm from "@/components/organisms/ContactForm";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Contacts error:", err);
    } finally {
      setLoading(false);
    }
  };

const handleCreateContact = async (contactData) => {
    try {
      const newContact = await contactService.create({
        first_name_c: contactData.firstName,
        last_name_c: contactData.lastName,
        email_c: contactData.email,
        phone_c: contactData.phone,
        company_c: contactData.company,
        position_c: contactData.position
      });
      
      setContacts(prev => [newContact, ...prev]);
      
      // Provide feedback about email status
      if (newContact._emailSent) {
        toast.success(`Contact created and welcome email sent to ${contactData.email}!`);
      } else if (newContact._emailError) {
        toast.success("Contact created successfully!");
        toast.warning(`Welcome email could not be sent: ${newContact._emailError}`);
      } else {
        toast.success("Contact created successfully!");
      }
      
    } catch (error) {
      throw new Error("Failed to create contact");
    }
  };

  const handleUpdateContact = async (contactData) => {
    try {
const updatedContact = await contactService.update(selectedContact.Id, {
        first_name_c: contactData.firstName,
        last_name_c: contactData.lastName,
        email_c: contactData.email,
        phone_c: contactData.phone,
        company_c: contactData.company,
        position_c: contactData.position
      });
      setContacts(prev => prev.map(contact => 
        contact.Id === updatedContact.Id ? updatedContact : contact
      ));
    } catch (error) {
      throw new Error("Failed to update contact");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      toast.success("Contact deleted successfully!");
      setIsDetailOpen(false);
    } catch (error) {
      toast.error("Failed to delete contact. Please try again.");
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
contact.first_name_c?.toLowerCase().includes(searchLower) ||
      contact.last_name_c?.toLowerCase().includes(searchLower) ||
      contact.email_c?.toLowerCase().includes(searchLower) ||
      contact.company_c?.toLowerCase().includes(searchLower)
    );
  });

  const openCreateForm = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const openEditForm = (contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const openContactDetail = (contact) => {
    setSelectedContact(contact);
    setIsDetailOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setIsDetailOpen(false);
    setSelectedContact(null);
  };

  if (loading) {
    return <Loading type="table" className="p-6" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-secondary mt-1">Manage your customer relationships</p>
        </div>
        <Button variant="primary" onClick={openCreateForm} className="inline-flex items-center">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
          className="max-w-md"
        />
      </div>

      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description={searchTerm ? "No contacts match your search criteria" : "Get started by adding your first contact"}
          icon="Users"
          actionLabel={!searchTerm ? "Add Contact" : undefined}
          onAction={!searchTerm ? openCreateForm : undefined}
        />
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.Id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
{contact.first_name_c?.[0]}{contact.last_name_c?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
{contact.first_name_c} {contact.last_name_c}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
<div className="text-sm text-gray-900">{contact.company_c}</div>
                      <div className="text-sm text-gray-500">{contact.position_c}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
<div className="text-sm text-gray-900">{contact.email_c}</div>
                      <div className="text-sm text-gray-500">{contact.phone_c}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{contact.last_activity_c ? format(new Date(contact.last_activity_c), "MMM dd, yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openContactDetail(contact)}
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(contact)}
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.Id)}
                          className="text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeModal}
        title={selectedContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={selectedContact ? handleUpdateContact : handleCreateContact}
          onCancel={closeModal}
        />
      </Modal>

      {/* Contact Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeModal}
        title="Contact Details"
        size="lg"
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
<span className="text-white text-xl font-bold">
                    {selectedContact.first_name_c?.[0]}{selectedContact.last_name_c?.[0]}
                  </span>
                </div>
                <div>
<h3 className="text-2xl font-bold text-gray-900">
                    {selectedContact.first_name_c} {selectedContact.last_name_c}
                  </h3>
                  <p className="text-secondary">{selectedContact.position} at {selectedContact.company}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditForm(selectedContact)}
                >
                  <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteContact(selectedContact.Id)}
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <Card.Header>
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
<span className="text-sm text-gray-900">{selectedContact.email_c}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
<span className="text-sm text-gray-900">{selectedContact.phone_c}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Building" className="w-4 h-4 text-gray-400" />
<span className="text-sm text-gray-900">{selectedContact.company_c}</span>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <h4 className="font-semibold text-gray-900">Timeline</h4>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-900">
{selectedContact.created_at_c ? format(new Date(selectedContact.created_at_c), "MMM dd, yyyy") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Activity</span>
<span className="text-gray-900">
                      {selectedContact.last_activity_c ? format(new Date(selectedContact.last_activity_c), "MMM dd, yyyy") : "N/A"}
                    </span>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Contacts;