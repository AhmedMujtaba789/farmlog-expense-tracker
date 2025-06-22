
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { db, Farmer } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const FarmerManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    phone: '',
  });

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    const farmersData = await db.getFarmers();
    setFarmers(farmersData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.addFarmer(formData);
      
      toast({
        title: "Success",
        description: "Farmer added successfully",
      });
      
      setFormData({ name: '', cnic: '', phone: '' });
      setIsDialogOpen(false);
      loadFarmers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add farmer",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this farmer?')) {
      await db.deleteFarmer(id);
      toast({
        title: "Success",
        description: "Farmer deleted successfully",
      });
      loadFarmers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('farmers')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {t('add_farmer')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('add_farmer')}</DialogTitle>
              <DialogDescription>
                Add a new farmer to your records
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t('farmer_name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnic">{t('cnic')}</Label>
                <Input
                  id="cnic"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {farmers.map((farmer) => (
          <Card key={farmer.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {farmer.name}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(farmer.id)}
                >
                  {t('delete')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>{t('cnic')}:</strong> {farmer.cnic}</p>
                <p><strong>{t('phone')}:</strong> {farmer.phone}</p>
                <p className="text-sm text-gray-500">
                  Added: {new Date(farmer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmerManagement;
