import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay(200);
    const contact = this.contacts.find(contact => contact.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await this.delay(400);
    const newContact = {
      ...contactData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay(400);
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id),
    };
    this.contacts[index] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return Math.max(...this.contacts.map(contact => contact.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ContactService();