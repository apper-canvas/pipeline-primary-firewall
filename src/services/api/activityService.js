class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'activity_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching activities:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.error("Activity not found:", response.message);
        throw new Error("Activity not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          Name: activityData.subject_c,
          type_c: activityData.type_c,
          subject_c: activityData.subject_c,
          description_c: activityData.description_c,
          contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : null,
          deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null,
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          throw new Error(failed[0].message || "Failed to create activity");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      const updateData = {
        Id: parseInt(id),
        Name: activityData.subject_c || activityData.Name
      };

      // Only include fields that are provided
      if (activityData.type_c) updateData.type_c = activityData.type_c;
      if (activityData.subject_c) updateData.subject_c = activityData.subject_c;
      if (activityData.description_c) updateData.description_c = activityData.description_c;
      if (activityData.contact_id_c) updateData.contact_id_c = parseInt(activityData.contact_id_c);
      if (activityData.deal_id_c) updateData.deal_id_c = parseInt(activityData.deal_id_c);

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
          throw new Error(failed[0].message || "Failed to update activity");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
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
        console.error("Error deleting activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          throw new Error(failed[0].message || "Failed to delete activity");
        }
        
        return { success: successful.length > 0 };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new ActivityService();

export default new ActivityService();