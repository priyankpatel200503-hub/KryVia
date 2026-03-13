import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function OTPVerificationScreen() {
  const { setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const phone = sessionStorage.getItem('signupPhone') || '';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      // In a real app, verify OTP with backend
      // For now, accept any 6-digit OTP
      setCurrentScreen('profile-setup');
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    setCanResend(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t.verifyOtp}</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to +91 {phone}
          </p>
        </div>

        {/* OTP Form */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Code</CardTitle>
            <CardDescription>This helps us verify your phone number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OTP Input */}
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            {/* Timer/Resend */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {timer}s
                </p>
              ) : (
                <Button 
                  variant="link" 
                  onClick={handleResendOTP}
                  className="text-sm p-0 h-auto"
                >
                  {t.resendOtp}
                </Button>
              )}
            </div>

            {/* Verify Button */}
            <Button 
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6}
              className="w-full"
            >
              {t.verifyOtp}
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setCurrentScreen('signup')}
          className="w-full"
        >
          {t.back}
        </Button>
      </div>
    </div>
  );
}