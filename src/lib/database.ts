
interface Land {
  id: string;
  name: string;
  location: string;
  area: number;
  farmerId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Farmer {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface Expense {
  id: string;
  landId: string;
  category: 'seed' | 'diesel' | 'machinery' | 'other' | 'lend';
  amount: number;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface CropIncome {
  id: string;
  landId: string;
  amount: number;
  season: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Offline-first storage using localStorage
class OfflineDatabase {
  private getStorageKey(table: string): string {
    return `landtrack_${table}`;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getAll<T>(table: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(table));
    return data ? JSON.parse(data) : [];
  }

  private save<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
  }

  // Lands
  async getLands(): Promise<Land[]> {
    return this.getAll<Land>('lands');
  }

  async addLand(land: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>): Promise<Land> {
    const lands = await this.getLands();
    const newLand: Land = {
      ...land,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    lands.push(newLand);
    this.save('lands', lands);
    return newLand;
  }

  async updateLand(id: string, updates: Partial<Land>): Promise<Land | null> {
    const lands = await this.getLands();
    const index = lands.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    lands[index] = { ...lands[index], ...updates, updatedAt: new Date().toISOString() };
    this.save('lands', lands);
    return lands[index];
  }

  async deleteLand(id: string): Promise<boolean> {
    const lands = await this.getLands();
    const filtered = lands.filter(l => l.id !== id);
    this.save('lands', filtered);
    return filtered.length < lands.length;
  }

  // Farmers
  async getFarmers(): Promise<Farmer[]> {
    return this.getAll<Farmer>('farmers');
  }

  async addFarmer(farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farmer> {
    const farmers = await this.getFarmers();
    const newFarmer: Farmer = {
      ...farmer,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    farmers.push(newFarmer);
    this.save('farmers', farmers);
    return newFarmer;
  }

  async updateFarmer(id: string, updates: Partial<Farmer>): Promise<Farmer | null> {
    const farmers = await this.getFarmers();
    const index = farmers.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    farmers[index] = { ...farmers[index], ...updates, updatedAt: new Date().toISOString() };
    this.save('farmers', farmers);
    return farmers[index];
  }

  async deleteFarmer(id: string): Promise<boolean> {
    const farmers = await this.getFarmers();
    const filtered = farmers.filter(f => f.id !== id);
    this.save('farmers', filtered);
    return filtered.length < farmers.length;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return this.getAll<Expense>('expenses');
  }

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const expenses = await this.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    this.save('expenses', expenses);
    return newExpense;
  }

  async getExpensesByLand(landId: string): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(e => e.landId === landId);
  }

  async deleteExpense(id: string): Promise<boolean> {
    const expenses = await this.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    this.save('expenses', filtered);
    return filtered.length < expenses.length;
  }

  // Crop Income
  async getCropIncomes(): Promise<CropIncome[]> {
    return this.getAll<CropIncome>('cropIncomes');
  }

  async addCropIncome(income: Omit<CropIncome, 'id' | 'createdAt' | 'updatedAt'>): Promise<CropIncome> {
    const incomes = await this.getCropIncomes();
    const newIncome: CropIncome = {
      ...income,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    incomes.push(newIncome);
    this.save('cropIncomes', incomes);
    return newIncome;
  }

  async getCropIncomesByLand(landId: string): Promise<CropIncome[]> {
    const incomes = await this.getCropIncomes();
    return incomes.filter(i => i.landId === landId);
  }
}

export const db = new OfflineDatabase();
export type { Land, Farmer, Expense, CropIncome };
