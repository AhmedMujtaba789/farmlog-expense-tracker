
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { db, Land, Expense } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const ExpenseManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    landId: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const categories = ['seed', 'diesel', 'machinery', 'other', 'lend'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const expensesData = await db.getExpenses();
    const landsData = await db.getLands();
    setExpenses(expensesData);
    setLands(landsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.addExpense({
        landId: formData.landId,
        category: formData.category as any,
        amount: parseFloat(formData.amount),
        date: formData.date,
        note: formData.note,
      });
      
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      
      setFormData({
        landId: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await db.deleteExpense(id);
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      loadData();
    }
  };

  const getLandName = (landId: string) => {
    const land = lands.find(l => l.id === landId);
    return land ? land.name : 'Unknown Land';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      seed: 'bg-green-100 text-green-800',
      diesel: 'bg-yellow-100 text-yellow-800',
      machinery: 'bg-blue-100 text-blue-800',
      other: 'bg-gray-100 text-gray-800',
      lend: 'bg-red-100 text-red-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('expenses')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              {t('add_expense')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('add_expense')}</DialogTitle>
              <DialogDescription>
                Record a new expense for your land
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="land">Land</Label>
                <Select value={formData.landId} onValueChange={(value) => setFormData({ ...formData, landId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select land" />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((land) => (
                      <SelectItem key={land.id} value={land.id}>
                        {land.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">{t('category')}</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">{t('amount')}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">{t('date')}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="note">{t('note')}</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Optional note about this expense"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">{t('save')}</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{getLandName(expense.landId)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {t(expense.category)}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                >
                  {t('delete')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p><strong>{t('amount')}:</strong> Rs. {expense.amount.toLocaleString()}</p>
                  <p><strong>{t('date')}:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  {expense.note && (
                    <p><strong>{t('note')}:</strong> {expense.note}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpenseManagement;
