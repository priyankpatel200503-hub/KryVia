import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function RoleSelectionScreen() {
  const { setCurrentScreen } = useApp();
  const { language } = useApp();
  const t = useTranslation(language);

  const handleRoleSelection = (role: 'farmer' | 'buyer') => {
    // Store selected role temporarily - will be used during signup
    sessionStorage.setItem('selectedRole', role);
    setCurrentScreen('signup');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t.chooseRole}</h1>
          <p className="text-muted-foreground">Select how you want to use KryVia</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {/* Farmer Card */}
          <Card className="border-2 border-transparent hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">🌾</div>
              <CardTitle className="text-xl">{t.farmer}</CardTitle>
              <CardDescription>{t.farmerDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleRoleSelection('farmer')}
                className="w-full"
                variant="default"
              >
                {t.continueAsFarmer}
              </Button>
            </CardContent>
          </Card>

          {/* Buyer Card */}
          <Card className="border-2 border-transparent hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">🏭</div>
              <CardTitle className="text-xl">{t.buyer}</CardTitle>
              <CardDescription>{t.buyerDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleRoleSelection('buyer')}
                className="w-full"
                variant="secondary"
              >
                {t.continueAsBuyer}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}