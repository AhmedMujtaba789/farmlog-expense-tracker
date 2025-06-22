
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { db, Land, Farmer } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const LandManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [lands, setLands] = useState<Land[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    farmerId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const landsData = await db.getLands();
    const farmersData = await db.getFarmers();
    setLands(landsData);
    setFarmers(farmersData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.addLand({
        name: formData.name,
        location: formData.location,
        area: parseFloat(formData.area),
        farmerId: formData.farmerId || undefined,
      });
      
      toast({
        title: "Success",
        description: "Land added successfully",
      });
      
      setFormData({ name: '', location: '', area: '', farmerId: '' });
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add land",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this land?')) {
      await db.deleteLand(id);
      toast({
        title: "Success",
        description: "Land deleted successfully",
      });
      loadData();
    }
  };

  const getFarmerName = (farmerId?: string) => {
    if (!farmerId) return 'Unassigned';
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer ? farmer.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('lands')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              {t('add_land')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('add_land')}</DialogTitle>
              <DialogDescription>
                Add a new land to your portfolio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t('land_name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="area">{t('area')}</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="farmer">Assign Farmer (Optional)</Label>
                <Select value={formData.farmerId} onValueChange={(value) => setFormData({ ...formData, farmerId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No farmer assigned</SelectItem>
                    {farmers.map((farmer) => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        {lands.map((land) => (
          <Card key={land.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {land.name}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(land.id)}
                >
                  {t('delete')}
                </Button>
              </CardTitle>
              <CardDescription>{land.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>{t('area')}:</strong> {land.area} acres</p>
                <p><strong>Farmer:</strong> {getFarmerName(land.farmerId)}</p>
                <p className="text-sm text-gray-500">
                  Added: {new Date(land.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandManagement;
