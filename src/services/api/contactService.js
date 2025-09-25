class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_activity_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching contacts:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_activity_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.error("Contact not found:", response.message);
        throw new Error("Contact not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

async create(contactData) {
    try {
      const params = {
        records: [{
          Name: contactData.first_name_c + " " + contactData.last_name_c,
          first_name_c: contactData.first_name_c,
          last_name_c: contactData.last_name_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          company_c: contactData.company_c,
          position_c: contactData.position_c,
          created_at_c: new Date().toISOString(),
          last_activity_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating contact:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          throw new Error(failed[0].message || "Failed to create contact");
        }
        
        const createdContact = successful[0]?.data || {};
        
        // Send welcome email after successful contact creation
        if (createdContact && contactData.email_c) {
          try {
            const emailResponse = await this.apperClient.functions.invoke(
              import.meta.env.VITE_SEND_WELCOME_EMAIL,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contactName: contactData.first_name_c + " " + contactData.last_name_c,
                  contactEmail: contactData.email_c
                })
              }
            );
            
            // Add email status to contact object for UI feedback
            createdContact._emailSent = emailResponse.success || false;
            createdContact._emailError = emailResponse.success ? null : emailResponse.message;
            
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't throw - contact creation should succeed even if email fails
            createdContact._emailSent = false;
            createdContact._emailError = emailError.message || "Email service unavailable";
          }
        }
        
        return createdContact;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: contactData.first_name_c + " " + contactData.last_name_c,
          first_name_c: contactData.first_name_c,
          last_name_c: contactData.last_name_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          company_c: contactData.company_c,
          position_c: contactData.position_c,
          last_activity_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating contact:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          throw new Error(failed[0].message || "Failed to update contact");
        }
        
        return successful[0]?.data || {};
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
        console.error("Error deleting contact:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          throw new Error(failed[0].message || "Failed to delete contact");
        }
        
        return { success: successful.length > 0 };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new ContactService();