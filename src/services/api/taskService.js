class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.error("Task not found:", response.message);
        throw new Error("Task not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title_c,
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          status_c: taskData.status_c || "pending",
          contact_id_c: taskData.contact_id_c ? parseInt(taskData.contact_id_c) : null,
          deal_id_c: taskData.deal_id_c ? parseInt(taskData.deal_id_c) : null
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          throw new Error(failed[0].message || "Failed to create task");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title_c || taskData.Name
      };

      // Only include fields that are provided
      if (taskData.title_c) updateData.title_c = taskData.title_c;
      if (taskData.description_c) updateData.description_c = taskData.description_c;
      if (taskData.due_date_c) updateData.due_date_c = taskData.due_date_c;
      if (taskData.priority_c) updateData.priority_c = taskData.priority_c;
      if (taskData.status_c) updateData.status_c = taskData.status_c;
      if (taskData.contact_id_c) updateData.contact_id_c = parseInt(taskData.contact_id_c);
      if (taskData.deal_id_c) updateData.deal_id_c = parseInt(taskData.deal_id_c);

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          throw new Error(failed[0].message || "Failed to update task");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
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
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          throw new Error(failed[0].message || "Failed to delete task");
        }
        
        return { success: successful.length > 0 };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new TaskService();

export default new TaskService();