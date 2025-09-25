import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.deals];
  }

  async getById(id) {
    await this.delay(200);
    const deal = this.deals.find(deal => deal.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await this.delay(400);
    const newDeal = {
      ...dealData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay(400);
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
    };
    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return Math.max(...this.deals.map(deal => deal.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DealService();