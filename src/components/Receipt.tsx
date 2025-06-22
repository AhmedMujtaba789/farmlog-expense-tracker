
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReceiptProps {
  calculation: any;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ calculation, onClose }) => {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{t('receipt')}</span>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                {t('print')}
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="print:p-8 space-y-6" id="receipt">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold">LandTrack</h1>
            <h2 className="text-xl">Agricultural Settlement Receipt</h2>
            <p className="text-sm text-gray-600">
              Date: {new Date(calculation.date).toLocaleDateString()}
            </p>
          </div>

          {/* Land & Farmer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Land Details</h3>
              <p><strong>Name:</strong> {calculation.land?.name}</p>
              <p><strong>Location:</strong> {calculation.land?.location}</p>
              <p><strong>Area:</strong> {calculation.land?.area} acres</p>
            </div>
            
            {calculation.farmer && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Farmer Details</h3>
                <p><strong>Name:</strong> {calculation.farmer.name}</p>
                <p><strong>CNIC:</strong> {calculation.farmer.cnic}</p>
                <p><strong>Phone:</strong> {calculation.farmer.phone}</p>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Financial Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p><strong>Total Crop Income:</strong></p>
                <p><strong>Total Expenses:</strong></p>
                <p><strong>Net Profit:</strong></p>
              </div>
              <div className="space-y-1 text-right">
                <p>Rs. {calculation.totalIncome.toLocaleString()}</p>
                <p>Rs. {calculation.totalExpenses.toLocaleString()}</p>
                <p className="font-semibold">Rs. {calculation.netProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Profit Distribution */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Profit Distribution</h3>
            
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p><strong>Landlord Share (75%):</strong></p>
                  <p><strong>Farmer Gross Share (25%):</strong></p>
                  <p><strong>Less: Expense Share (25%):</strong></p>
                  <p><strong>Less: Lend Amount:</strong></p>
                  <hr className="my-2" />
                  <p><strong>Farmer Net Amount:</strong></p>
                </div>
                <div className="space-y-1 text-right">
                  <p>Rs. {calculation.landlordShare.toLocaleString()}</p>
                  <p>Rs. {calculation.farmerGrossShare.toLocaleString()}</p>
                  <p>Rs. {calculation.farmerExpenseShare.toLocaleString()}</p>
                  <p>Rs. {calculation.farmerLendDeduction.toLocaleString()}</p>
                  <hr className="my-2" />
                  <p className={`font-bold ${calculation.farmerNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rs. {calculation.farmerNetProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {calculation.farmerNetProfit < 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-800 font-semibold">
                  Amount Due from Farmer: Rs. {Math.abs(calculation.farmerNetProfit).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Expense Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Expense Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(calculation.expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>{t(category)}:</span>
                  <span>Rs. {Number(amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t">
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 h-12"></div>
              <p className="font-semibold">Landlord Signature</p>
              <p className="text-sm text-gray-600">Date: ___________</p>
            </div>
            
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2 h-12"></div>
              <p className="font-semibold">Farmer Signature</p>
              <p className="text-sm text-gray-600">Date: ___________</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
            <p>This receipt was generated by LandTrack Agricultural Management System</p>
            <p>Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Receipt;
