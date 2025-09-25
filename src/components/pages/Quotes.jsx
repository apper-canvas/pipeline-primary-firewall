import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import quoteService from "@/services/api/quoteService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import QuoteForm from "@/components/organisms/QuoteForm";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const statusColors = {
    Draft: "secondary",
    Sent: "info",
    Accepted: "success",
    Rejected: "error"
  };

  useEffect(() => {
    loadQuotesData();
  }, []);

  const loadQuotesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [quotesData, contactsData, dealsData] = await Promise.all([
        quoteService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setQuotes(quotesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      console.error("Error loading quotes data:", err);
      setError("Failed to load quotes data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = async (quoteData) => {
    try {
      const newQuote = await quoteService.create(quoteData);
      await loadQuotesData();
      toast.success("Quote created successfully!");
      return newQuote;
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.error("Failed to create quote. Please try again.");
      throw error;
    }
  };

  const handleUpdateQuote = async (quoteData) => {
    try {
      const updatedQuote = await quoteService.update(selectedQuote.Id, quoteData);
      await loadQuotesData();
      toast.success("Quote updated successfully!");
      return updatedQuote;
    } catch (error) {
      console.error("Error updating quote:", error);
      toast.error("Failed to update quote. Please try again.");
      throw error;
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!confirm("Are you sure you want to delete this quote?")) {
      return;
    }

    try {
      await quoteService.delete(quoteId);
      await loadQuotesData();
      toast.success("Quote deleted successfully!");
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast.error("Failed to delete quote. Please try again.");
    }
  };

  const openCreateForm = () => {
    setSelectedQuote(null);
    setIsFormOpen(true);
  };

  const openEditForm = (quote) => {
    setSelectedQuote(quote);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setSelectedQuote(null);
  };

  const getContactName = (contactId) => {
    if (!contactId) return "N/A";
    const contact = contacts.find(c => c.Id === (contactId.Id || contactId));
    return contact ? `${contact.first_name_c} ${contact.last_name_c}` : "N/A";
  };

  const getDealName = (dealId) => {
    if (!dealId) return "N/A";
    const deal = deals.find(d => d.Id === (dealId.Id || dealId));
    return deal ? deal.title_c : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.company_c?.toLowerCase().includes(searchLower) ||
      quote.Name?.toLowerCase().includes(searchLower) ||
      quote.status_c?.toLowerCase().includes(searchLower) ||
      getContactName(quote.contact_id_c).toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadQuotesData} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="text-secondary mt-1">Manage your sales quotes</p>
        </div>
        <Button variant="primary" onClick={openCreateForm} className="inline-flex items-center">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Quote
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search quotes..."
          className="max-w-md"
        />
      </div>

      {filteredQuotes.length === 0 ? (
        <Empty
          title="No quotes found"
          description={searchTerm ? "No quotes match your search criteria" : "Get started by creating your first quote"}
          icon="File"
          actionLabel={!searchTerm ? "Add Quote" : undefined}
          onAction={!searchTerm ? openCreateForm : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => (
            <Card key={quote.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {quote.company_c || "Untitled Quote"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getContactName(quote.contact_id_c)}
                  </p>
                </div>
                <Badge variant={statusColors[quote.status_c] || "secondary"}>
                  {quote.status_c || "Draft"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deal:</span>
                  <span className="text-gray-900">{getDealName(quote.deal_id_c)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quote Date:</span>
                  <span className="text-gray-900">{formatDate(quote.quote_date_c)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expires:</span>
                  <span className="text-gray-900">{formatDate(quote.expires_on_c)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery:</span>
                  <span className="text-gray-900">{quote.delivery_method_c || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-gray-500">
                  Created {formatDate(quote.CreatedOn)}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditForm(quote)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuote(quote.Id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quote Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeModal}
        title={selectedQuote ? "Edit Quote" : "Add New Quote"}
        size="xl"
      >
        <QuoteForm
          quote={selectedQuote}
          contacts={contacts}
          deals={deals}
          onSave={selectedQuote ? handleUpdateQuote : handleCreateQuote}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Quotes;