class QuoteService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'quote_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_name_c"}},
          {"field": {"Name": "billing_street_c"}},
          {"field": {"Name": "billing_city_c"}},
          {"field": {"Name": "billing_state_c"}},
          {"field": {"Name": "billing_country_c"}},
          {"field": {"Name": "billing_pincode_c"}},
          {"field": {"Name": "shipping_name_c"}},
          {"field": {"Name": "shipping_street_c"}},
          {"field": {"Name": "shipping_city_c"}},
          {"field": {"Name": "shipping_state_c"}},
          {"field": {"Name": "shipping_country_c"}},
          {"field": {"Name": "shipping_pincode_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching quotes:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_name_c"}},
          {"field": {"Name": "billing_street_c"}},
          {"field": {"Name": "billing_city_c"}},
          {"field": {"Name": "billing_state_c"}},
          {"field": {"Name": "billing_country_c"}},
          {"field": {"Name": "billing_pincode_c"}},
          {"field": {"Name": "shipping_name_c"}},
          {"field": {"Name": "shipping_street_c"}},
          {"field": {"Name": "shipping_city_c"}},
          {"field": {"Name": "shipping_state_c"}},
          {"field": {"Name": "shipping_country_c"}},
          {"field": {"Name": "shipping_pincode_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.error("Quote not found:", response.message);
        throw new Error("Quote not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(quoteData) {
    try {
      const params = {
        records: [{
          Name: quoteData.Name || `Quote-${Date.now()}`,
          company_c: quoteData.company_c,
          contact_id_c: parseInt(quoteData.contact_id_c),
          deal_id_c: parseInt(quoteData.deal_id_c),
          quote_date_c: quoteData.quote_date_c,
          status_c: quoteData.status_c,
          delivery_method_c: quoteData.delivery_method_c,
          expires_on_c: quoteData.expires_on_c,
          billing_name_c: quoteData.billing_name_c,
          billing_street_c: quoteData.billing_street_c,
          billing_city_c: quoteData.billing_city_c,
          billing_state_c: quoteData.billing_state_c,
          billing_country_c: quoteData.billing_country_c,
          billing_pincode_c: quoteData.billing_pincode_c,
          shipping_name_c: quoteData.shipping_name_c,
          shipping_street_c: quoteData.shipping_street_c,
          shipping_city_c: quoteData.shipping_city_c,
          shipping_state_c: quoteData.shipping_state_c,
          shipping_country_c: quoteData.shipping_country_c,
          shipping_pincode_c: quoteData.shipping_pincode_c
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating quote:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
          throw new Error(failed[0].message || "Failed to create quote");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, quoteData) {
    try {
      const updateData = {
        Id: parseInt(id),
        Name: quoteData.Name || `Quote-${id}`
      };

      // Only include fields that are provided
      if (quoteData.company_c) updateData.company_c = quoteData.company_c;
      if (quoteData.contact_id_c) updateData.contact_id_c = parseInt(quoteData.contact_id_c);
      if (quoteData.deal_id_c) updateData.deal_id_c = parseInt(quoteData.deal_id_c);
      if (quoteData.quote_date_c) updateData.quote_date_c = quoteData.quote_date_c;
      if (quoteData.status_c) updateData.status_c = quoteData.status_c;
      if (quoteData.delivery_method_c) updateData.delivery_method_c = quoteData.delivery_method_c;
      if (quoteData.expires_on_c) updateData.expires_on_c = quoteData.expires_on_c;
      if (quoteData.billing_name_c) updateData.billing_name_c = quoteData.billing_name_c;
      if (quoteData.billing_street_c) updateData.billing_street_c = quoteData.billing_street_c;
      if (quoteData.billing_city_c) updateData.billing_city_c = quoteData.billing_city_c;
      if (quoteData.billing_state_c) updateData.billing_state_c = quoteData.billing_state_c;
      if (quoteData.billing_country_c) updateData.billing_country_c = quoteData.billing_country_c;
      if (quoteData.billing_pincode_c) updateData.billing_pincode_c = quoteData.billing_pincode_c;
      if (quoteData.shipping_name_c) updateData.shipping_name_c = quoteData.shipping_name_c;
      if (quoteData.shipping_street_c) updateData.shipping_street_c = quoteData.shipping_street_c;
      if (quoteData.shipping_city_c) updateData.shipping_city_c = quoteData.shipping_city_c;
      if (quoteData.shipping_state_c) updateData.shipping_state_c = quoteData.shipping_state_c;
      if (quoteData.shipping_country_c) updateData.shipping_country_c = quoteData.shipping_country_c;
      if (quoteData.shipping_pincode_c) updateData.shipping_pincode_c = quoteData.shipping_pincode_c;

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating quote:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
          throw new Error(failed[0].message || "Failed to update quote");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting quote:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          throw new Error(failed[0].message || "Failed to delete quote");
        }
        
        return { success: successful.length > 0 };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new QuoteService();