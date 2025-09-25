import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await this.delay(200);
    const activity = this.activities.find(activity => activity.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await this.delay(400);
    const newActivity = {
      ...activityData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay(400);
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id),
    };
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return { success: true };
  }

  getNextId() {
    return Math.max(...this.activities.map(activity => activity.Id), 0) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ActivityService();