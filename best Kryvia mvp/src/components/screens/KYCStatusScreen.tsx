import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export function KYCStatusScreen() {
  const { user, updateUser, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  if (!user) return null;

  const handleContinue = () => {
    if (user.kycStatus === 'verified') {
      setCurrentScreen(user.role === 'farmer' ? 'farmer-home' : 'buyer-home');
    }
  };

  const handleResubmit = () => {
    updateUser({ kycStatus: 'pending' });
    setCurrentScreen('kyc-upload');
  };

  // Simulate verification for demo (in real app, this would be handled by backend)
  const handleSimulateVerification = () => {
    updateUser({ kycStatus: 'verified', isVerified: true });
  };

  const getStatusInfo = () => {
    switch (user.kycStatus) {
      case 'under_review':
        return {
          icon: <Clock className="h-12 w-12 text-warning" />,
          title: t.underReview,
          description: 'Your documents are being reviewed. This usually takes 24-48 hours.',
          badgeVariant: 'secondary' as const,
          canContinue: false,
        };
      case 'verified':
        return {
          icon: <CheckCircle className="h-12 w-12 text-success" />,
          title: t.verified,
          description: 'Your account is verified! You can now start using all features.',
          badgeVariant: 'default' as const,
          canContinue: true,
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title: t.rejected,
          description: 'Your documents were rejected. Please upload correct documents.',
          badgeVariant: 'destructive' as const,
          canContinue: false,
        };
      default:
        return {
          icon: <RefreshCw className="h-12 w-12 text-muted-foreground" />,
          title: t.pending,
          description: 'Please complete your KYC upload.',
          badgeVariant: 'outline' as const,
          canContinue: false,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Status Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {statusInfo.icon}
            </div>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>KYC Status</span>
              <Badge variant={statusInfo.badgeVariant}>{statusInfo.title}</Badge>
            </CardTitle>
            <CardDescription className="text-center">
              {statusInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Browse limitation message for unverified users */}
            {user.kycStatus !== 'verified' && (
              <div className="p-3 bg-accent rounded-lg text-sm text-center">
                {t.canBrowseOnly}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {statusInfo.canContinue && (
                <Button onClick={handleContinue} className="w-full">
                  {t.continue}
                </Button>
              )}

              {user.kycStatus === 'rejected' && (
                <Button onClick={handleResubmit} variant="outline" className="w-full">
                  {t.resubmit}
                </Button>
              )}

              {user.kycStatus === 'under_review' && (
                <Button 
                  onClick={handleSimulateVerification} 
                  variant="outline" 
                  className="w-full"
                >
                  Simulate Verification (Demo)
                </Button>
              )}

              {user.kycStatus === 'pending' && (
                <>
                  <Button 
                    onClick={handleSimulateVerification} 
                    variant="outline" 
                    className="w-full"
                  >
                    Simulate Verification (Demo)
                  </Button>
                  <Button 
                    onClick={() => setCurrentScreen('kyc-upload')} 
                    variant="default" 
                    className="w-full"
                  >
                    Complete KYC Upload
                  </Button>
                </>
              )}

              {/* Browse button for unverified users */}
              {user.kycStatus !== 'verified' && (
                <Button 
                  onClick={() => setCurrentScreen(user.role === 'farmer' ? 'farmer-home' : 'buyer-home')}
                  variant="ghost" 
                  className="w-full"
                >
                  Browse (Limited Access)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span>+91 {user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{user.district}, {user.state}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}