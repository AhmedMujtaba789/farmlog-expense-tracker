
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import Dashboard from '@/components/Dashboard';
import LandManagement from '@/components/LandManagement';
import FarmerManagement from '@/components/FarmerManagement';
import ExpenseManagement from '@/components/ExpenseManagement';
import ProfitCalculator from '@/components/ProfitCalculator';

const Index = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-600">LandTrack</h1>
                <p className="text-xs text-gray-500">Agricultural Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {t('dashboard')}
            </TabsTrigger>
            <TabsTrigger 
              value="lands"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {t('lands')}
            </TabsTrigger>
            <TabsTrigger 
              value="farmers"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {t('farmers')}
            </TabsTrigger>
            <TabsTrigger 
              value="expenses"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {t('expenses')}
            </TabsTrigger>
            <TabsTrigger 
              value="calculator"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Calculator
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <TabsContent value="dashboard" className="mt-0">
              <Dashboard />
            </TabsContent>

            <TabsContent value="lands" className="mt-0">
              <LandManagement />
            </TabsContent>

            <TabsContent value="farmers" className="mt-0">
              <FarmerManagement />
            </TabsContent>

            <TabsContent value="expenses" className="mt-0">
              <ExpenseManagement />
            </TabsContent>

            <TabsContent value="calculator" className="mt-0">
              <ProfitCalculator />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
