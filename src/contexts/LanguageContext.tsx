
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur' | 'sd';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  // Navigation
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ', sd: 'ڊيش بورڊ' },
  lands: { en: 'Lands', ur: 'زمینیں', sd: 'زمينون' },
  farmers: { en: 'Farmers', ur: 'کسان', sd: 'هاري' },
  expenses: { en: 'Expenses', ur: 'اخراجات', sd: 'خرچ' },
  reports: { en: 'Reports', ur: 'رپورٹس', sd: 'رپورٽس' },
  
  // Dashboard
  total_lands: { en: 'Total Lands', ur: 'کل زمینیں', sd: 'ڪل زمينون' },
  total_farmers: { en: 'Total Farmers', ur: 'کل کسان', sd: 'ڪل هاري' },
  total_expenses: { en: 'Total Expenses', ur: 'کل اخراجات', sd: 'ڪل خرچ' },
  total_income: { en: 'Total Income', ur: 'کل آمدنی', sd: 'ڪل آمدني' },
  
  // Land Management
  add_land: { en: 'Add Land', ur: 'زمین شامل کریں', sd: 'زمين شامل ڪريو' },
  land_name: { en: 'Land Name', ur: 'زمین کا نام', sd: 'زمين جو نالو' },
  location: { en: 'Location', ur: 'مقام', sd: 'جاءِ' },
  area: { en: 'Area (Acres)', ur: 'رقبہ (ایکڑ)', sd: 'علائقو (ايڪڙ)' },
  
  // Farmer Management
  add_farmer: { en: 'Add Farmer', ur: 'کسان شامل کریں', sd: 'هاري شامل ڪريو' },
  farmer_name: { en: 'Farmer Name', ur: 'کسان کا نام', sd: 'هاري جو نالو' },
  cnic: { en: 'CNIC', ur: 'شناختی کارڈ', sd: 'سڃاڻپ ڪارڊ' },
  phone: { en: 'Phone', ur: 'فون', sd: 'فون' },
  
  // Expense Management
  add_expense: { en: 'Add Expense', ur: 'خرچ شامل کریں', sd: 'خرچ شامل ڪريو' },
  category: { en: 'Category', ur: 'قسم', sd: 'قسم' },
  amount: { en: 'Amount', ur: 'رقم', sd: 'رقم' },
  date: { en: 'Date', ur: 'تاریخ', sd: 'تاريخ' },
  note: { en: 'Note', ur: 'نوٹ', sd: 'نوٽ' },
  
  // Categories
  seed: { en: 'Seed', ur: 'بیج', sd: 'ٻج' },
  diesel: { en: 'Diesel', ur: 'ڈیزل', sd: 'ڊيزل' },
  machinery: { en: 'Machinery', ur: 'مشینری', sd: 'مشينري' },
  other: { en: 'Other', ur: 'دیگر', sd: 'ٻيو' },
  lend: { en: 'Lend', ur: 'قرض', sd: 'قرض' },
  
  // Profit Calculator
  crop_income: { en: 'Crop Income', ur: 'فصل کی آمدنی', sd: 'فصل جي آمدني' },
  calculate_profit: { en: 'Calculate Profit', ur: 'منافع کیلکولیٹ کریں', sd: 'منافعو ڳڻيو' },
  landlord_share: { en: 'Landlord Share (75%)', ur: 'مالک کا حصہ (75%)', sd: 'مالڪ جو حصو (75%)' },
  farmer_share: { en: 'Farmer Share (25%)', ur: 'کسان کا حصہ (25%)', sd: 'هاري جو حصو (25%)' },
  
  // Common
  save: { en: 'Save', ur: 'محفوظ کریں', sd: 'محفوظ ڪريو' },
  cancel: { en: 'Cancel', ur: 'منسوخ', sd: 'منسوخ' },
  edit: { en: 'Edit', ur: 'تبدیلی', sd: 'تبديلي' },
  delete: { en: 'Delete', ur: 'حذف', sd: 'ختم ڪريو' },
  print: { en: 'Print', ur: 'پرنٹ', sd: 'پرنٽ' },
  receipt: { en: 'Receipt', ur: 'رسید', sd: 'رسيد' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ur', 'sd'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    return translation ? translation[language] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
