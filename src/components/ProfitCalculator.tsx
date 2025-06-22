
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { db, Land, Expense, Farmer } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import Receipt from './Receipt';

const ProfitCalculator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [lands, setLands] = useState<Land[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedLand, setSelectedLand] = useState('');
  const [cropIncome, setCropIncome] = useState('');
  const [calculation, setCalculation] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const landsData = await db.getLands();
    const farmersData = await db.getFarmers();
    setLands(landsData);
    setFarmers(farmersData);
  };

  const calculateProfit = async () => {
    if (!selectedLand || !cropIncome) {
      toast({
        title: "Error",
        description: "Please select a land and enter crop income",
        variant: "destructive",
      });
      return;
    }

    const land = lands.find(l => l.id === selectedLand);
    const farmer = farmers.find(f => f.id === land?.farmerId);
    const expenses = await db.getExpensesByLand(selectedLand);
    
    const totalIncome = parseFloat(cropIncome);
    
    // Calculate different types of expenses
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const farmingExpenses = (expensesByCategory.seed || 0) + 
                           (expensesByCategory.diesel || 0) + 
                           (expensesByCategory.machinery || 0) + 
                           (expensesByCategory.other || 0);
    
    const lendAmount = expensesByCategory.lend || 0;
    const totalExpenses = farmingExpenses + lendAmount;

    // Net profit calculation
    const netProfit = totalIncome - totalExpenses;
    
    // Profit sharing (75% landlord, 25% farmer)
    const landlordShare = netProfit * 0.75;
    const farmerGrossShare = netProfit * 0.25;
    
    // Farmer deductions (25% of farming expenses + 100% of lend)
    const farmerExpenseShare = farmingExpenses * 0.25;
    const farmerLendDeduction = lendAmount;
    const totalFarmerDeductions = farmerExpenseShare + farmerLendDeduction;
    
    // Final farmer profit
    const farmerNetProfit = farmerGrossShare - totalFarmerDeductions;

    const result = {
      land,
      farmer,
      totalIncome,
      totalExpenses,
      farmingExpenses,
      lendAmount,
      netProfit,
      landlordShare,
      farmerGrossShare,
      farmerExpenseShare,
      farmerLendDeduction,
      totalFarmerDeductions,
      farmerNetProfit,
      expensesByCategory,
      date: new Date().toISOString(),
    };

    setCalculation(result);

    // Save crop income to database
    await db.addCropIncome({
      landId: selectedLand,
      amount: totalIncome,
      season: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
      date: new Date().toISOString(),
    });

    toast({
      title: "Success",
      description: "Profit calculated successfully",
    });
  };

  const handlePrintReceipt = () => {
    setShowReceipt(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('calculate_profit')}</CardTitle>
          <CardDescription>
            Calculate profit sharing between landlord and farmer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="land">Select Land</Label>
            <Select value={selectedLand} onValueChange={setSelectedLand}>
              <SelectTrigger>
                <SelectValue placeholder="Select a land" />
              </SelectTrigger>
              <SelectContent>
                {lands.map((land) => (
                  <SelectItem key={land.id} value={land.id}>
                    {land.name} ({land.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="income">{t('crop_income')}</Label>
            <Input
              id="income"
              type="number"
              step="0.01"
              value={cropIncome}
              onChange={(e) => setCropIncome(e.target.value)}
              placeholder="Enter total crop income"
            />
          </div>

          <Button onClick={calculateProfit} className="w-full">
            {t('calculate_profit')}
          </Button>
        </CardContent>
      </Card>

      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Profit Calculation Results
              <Button onClick={handlePrintReceipt} variant="outline">
                {t('print')} {t('receipt')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Income & Expenses</h3>
                <div className="space-y-2">
                  <p><strong>Total Income:</strong> Rs. {calculation.totalIncome.toLocaleString()}</p>
                  <p><strong>Farming Expenses:</strong> Rs. {calculation.farmingExpenses.toLocaleString()}</p>
                  <p><strong>Lend Amount:</strong> Rs. {calculation.lendAmount.toLocaleString()}</p>
                  <p><strong>Total Expenses:</strong> Rs. {calculation.totalExpenses.toLocaleString()}</p>
                  <p className="text-lg font-semibold">
                    <strong>Net Profit:</strong> Rs. {calculation.netProfit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profit Distribution</h3>
                <div className="space-y-2">
                  <p><strong>{t('landlord_share')}:</strong> Rs. {calculation.landlordShare.toLocaleString()}</p>
                  <p><strong>Farmer Gross Share (25%):</strong> Rs. {calculation.farmerGrossShare.toLocaleString()}</p>
                  <p><strong>Farmer Expense Share:</strong> Rs. {calculation.farmerExpenseShare.toLocaleString()}</p>
                  <p><strong>Farmer Lend Deduction:</strong> Rs. {calculation.farmerLendDeduction.toLocaleString()}</p>
                  <p className="text-lg font-semibold">
                    <strong>Farmer Final Profit:</strong> 
                    <span className={calculation.farmerNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      Rs. {calculation.farmerNetProfit.toLocaleString()}
                    </span>
                  </p>
                  {calculation.farmerNetProfit < 0 && (
                    <p className="text-red-600 text-sm">
                      Farmer owes: Rs. {Math.abs(calculation.farmerNetProfit).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Expense Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(calculation.expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-sm font-medium">{t(category)}</p>
                    <p className="text-sm">Rs. {Number(amount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showReceipt && calculation && (
        <Receipt
          calculation={calculation}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default ProfitCalculator;
