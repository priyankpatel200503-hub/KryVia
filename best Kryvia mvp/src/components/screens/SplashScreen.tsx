import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function SplashScreen() {
  const { language, setLanguage, setCurrentScreen, login } = useApp();
  const t = useTranslation(language);

  const handleGetStarted = () => {
    setCurrentScreen('role-selection');
  };

  // Demo login functions
  const loginAsFarmer = () => {
    const demoFarmer = {
      id: 'farmer1',
      phone: '9876543210',
      name: 'Rajesh Kumar Patel',
      role: 'farmer' as const,
      kycStatus: 'verified' as const,
      isVerified: true,
      state: 'Haryana',
      district: 'Karnal',
      village: 'Assandh',
    };
    login(demoFarmer);
  };

  const loginAsBuyer = () => {
    const demoBuyer = {
      id: 'buyer1',
      phone: '9876543211',
      name: 'Arjun Sharma',
      role: 'buyer' as const,
      kycStatus: 'verified' as const,
      isVerified: true,
      state: 'Gujarat',
      district: 'Ahmedabad',
      businessName: 'Premium Rice Exporters Ltd',
      businessType: 'export',
    };
    login(demoBuyer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-4">
          <div className="text-6xl">🌾</div>
          <h1 className="text-3xl font-bold text-primary">{t.appName}</h1>
          <p className="text-muted-foreground">{t.tagline}</p>
        </div>

        {/* Language Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.preferredLanguage}</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t.english}</SelectItem>
              <SelectItem value="hi">{t.hindi}</SelectItem>
              <SelectItem value="gu">{t.gujarati}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Demo Access Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🚀 Quick Demo Access</CardTitle>
            <CardDescription className="text-sm">
              Try the app instantly with demo accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={loginAsFarmer}
              variant="outline"
              className="w-full h-10 bg-primary/10 hover:bg-primary/20 border-primary/30"
            >
              🌾 Demo as Farmer
            </Button>
            <Button 
              onClick={loginAsBuyer}
              variant="outline"
              className="w-full h-10 bg-secondary/10 hover:bg-secondary/20 border-secondary/30"
            >
              🏭 Demo as Buyer
            </Button>
          </CardContent>
        </Card>

        {/* Regular Sign Up */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or create new account
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleGetStarted}
            className="w-full h-12 text-base"
            size="lg"
          >
            {t.getStarted}
          </Button>
        </div>

        {/* Features Highlight */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✅ Direct Farmer-to-Buyer Trading</p>
          <p>✅ Real-time Price Discovery</p>
          <p>✅ Secure Payment System</p>
          <p>✅ Multi-language Support</p>
        </div>
      </div>
    </div>
  );
}