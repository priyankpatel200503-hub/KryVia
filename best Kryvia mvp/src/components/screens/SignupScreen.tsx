import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function SignupScreen() {
  const { setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const selectedRole = sessionStorage.getItem('selectedRole') as 'farmer' | 'buyer';

  const handleGetOTP = () => {
    if (phone.length === 10 && agreedToTerms) {
      // Store phone for OTP verification
      sessionStorage.setItem('signupPhone', phone);
      setCurrentScreen('otp-verification');
    }
  };

  const isValid = phone.length === 10 && agreedToTerms;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">
            {selectedRole === 'farmer' ? '🌾' : '🏭'}
          </div>
          <h1 className="text-2xl font-bold">
            {selectedRole === 'farmer' ? t.farmer : t.buyer} {t.continue}
          </h1>
          <p className="text-muted-foreground">Enter your phone number to get started</p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>We'll send you an OTP to verify your number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phoneNumber}</Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  <span className="text-sm">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="rounded-l-none"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                {t.agreeTerms}
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleGetOTP}
              disabled={!isValid}
              className="w-full"
            >
              {t.getOtp}
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setCurrentScreen('role-selection')}
          className="w-full"
        >
          {t.back}
        </Button>
      </div>
    </div>
  );
}