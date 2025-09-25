class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching deals:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.error("Deal not found:", response.message);
        throw new Error("Deal not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          Name: dealData.title_c,
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c),
          expected_close_date_c: dealData.expected_close_date_c,
          description_c: dealData.description_c,
          contact_id_c: parseInt(dealData.contact_id_c),
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating deal:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          throw new Error(failed[0].message || "Failed to create deal");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const updateData = {
        Id: parseInt(id),
        Name: dealData.title_c || dealData.Name
      };

      // Only include fields that are provided
      if (dealData.title_c) updateData.title_c = dealData.title_c;
      if (dealData.value_c !== undefined) updateData.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c) updateData.stage_c = dealData.stage_c;
      if (dealData.probability_c !== undefined) updateData.probability_c = parseInt(dealData.probability_c);
      if (dealData.expected_close_date_c) updateData.expected_close_date_c = dealData.expected_close_date_c;
      if (dealData.description_c) updateData.description_c = dealData.description_c;
      if (dealData.contact_id_c) updateData.contact_id_c = parseInt(dealData.contact_id_c);

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating deal:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
          throw new Error(failed[0].message || "Failed to update deal");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
        console.error("Error deleting deal:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          throw new Error(failed[0].message || "Failed to delete deal");
        }
        
        return { success: successful.length > 0 };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new DealService();

export default new DealService();