import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function ProfileSetupScreen() {
  const { setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  
  const selectedRole = sessionStorage.getItem('selectedRole') as 'farmer' | 'buyer';
  const phone = sessionStorage.getItem('signupPhone') || '';

  const [formData, setFormData] = useState({
    name: '',
    businessName: '', // For buyers
    state: '',
    district: '',
    village: '', // For farmers
    businessType: '', // For buyers
    preferredLanguage: language,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Store profile data
    sessionStorage.setItem('profileData', JSON.stringify({
      ...formData,
      role: selectedRole,
      phone: phone,
    }));
    setCurrentScreen('kyc-upload');
  };

  const isValid = formData.name && formData.state && formData.district && 
    (selectedRole === 'farmer' ? formData.village : formData.businessName && formData.businessType);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">
            {selectedRole === 'farmer' ? '🌾' : '🏭'}
          </div>
          <h1 className="text-2xl font-bold">Profile Setup</h1>
          <p className="text-muted-foreground">Tell us about yourself</p>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole === 'farmer' ? 'Farmer' : 'Buyer'} Details
            </CardTitle>
            <CardDescription>This information helps us verify your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Business Name (Buyers only) */}
            {selectedRole === 'buyer' && (
              <div className="space-y-2">
                <Label htmlFor="businessName">{t.businessName}</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
            )}

            {/* Preferred Language */}
            <div className="space-y-2">
              <Label>{t.preferredLanguage}</Label>
              <Select 
                value={formData.preferredLanguage} 
                onValueChange={(value) => handleInputChange('preferredLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t.english}</SelectItem>
                  <SelectItem value="hi">{t.hindi}</SelectItem>
                  <SelectItem value="gu">{t.gujarati}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">{t.state}</Label>
              <Select onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district">{t.district}</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="Enter district"
              />
            </div>

            {/* Village (Farmers only) */}
            {selectedRole === 'farmer' && (
              <div className="space-y-2">
                <Label htmlFor="village">{t.village}</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  placeholder="Enter village name"
                />
              </div>
            )}

            {/* Business Type (Buyers only) */}
            {selectedRole === 'buyer' && (
              <div className="space-y-2">
                <Label>{t.businessType}</Label>
                <Select onValueChange={(value) => handleInputChange('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="food-processing">Food Processing</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Continue Button */}
            <Button 
              onClick={handleContinue}
              disabled={!isValid}
              className="w-full"
            >
              {t.saveAndContinue}
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setCurrentScreen('otp-verification')}
          className="w-full"
        >
          {t.back}
        </Button>
      </div>
    </div>
  );
}