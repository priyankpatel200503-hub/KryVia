import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, FileImage, File, SkipForward } from 'lucide-react';

export function KYCUploadScreen() {
  const { setCurrentScreen, login, language } = useApp();
  const t = useTranslation(language);
  
  const selectedRole = sessionStorage.getItem('selectedRole') as 'farmer' | 'buyer';
  const profileData = JSON.parse(sessionStorage.getItem('profileData') || '{}');

  const [kycData, setKycData] = useState({
    aadhaarNumber: '',
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    landProof: null as File | null, // For farmers
    gstNumber: '', // For buyers
    gstCertificate: null as File | null, // For buyers
  });

  const handleFileUpload = (field: string, file: File | null) => {
    setKycData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = () => {
    // Create user object
    const userData = {
      id: Date.now().toString(),
      phone: profileData.phone,
      name: profileData.name,
      role: selectedRole,
      kycStatus: 'under_review' as const,
      isVerified: false,
      state: profileData.state,
      district: profileData.district,
      village: profileData.village,
      businessName: profileData.businessName,
      businessType: profileData.businessType,
    };

    // Store user data and login
    login(userData);
    
    // Clear session storage
    sessionStorage.removeItem('selectedRole');
    sessionStorage.removeItem('signupPhone');
    sessionStorage.removeItem('profileData');
  };

  const handleSkip = () => {
    // Create user object with pending KYC
    const userData = {
      id: Date.now().toString(),
      phone: profileData.phone,
      name: profileData.name,
      role: selectedRole,
      kycStatus: 'pending' as const,
      isVerified: false,
      state: profileData.state,
      district: profileData.district,
      village: profileData.village,
      businessName: profileData.businessName,
      businessType: profileData.businessType,
    };

    // Store user data and login (will go to KYC status screen)
    login(userData);
    
    // Clear session storage
    sessionStorage.removeItem('selectedRole');
    sessionStorage.removeItem('signupPhone');
    sessionStorage.removeItem('profileData');
  };

  const isValid = selectedRole === 'farmer' 
    ? kycData.aadhaarNumber.length === 12 && kycData.aadhaarFront && kycData.aadhaarBack && kycData.landProof
    : kycData.aadhaarNumber.length === 12 && kycData.aadhaarFront && kycData.aadhaarBack && kycData.gstNumber && kycData.gstCertificate;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">📄</div>
          <h1 className="text-2xl font-bold">{t.kycUpload}</h1>
          <p className="text-muted-foreground">Upload documents for verification</p>
        </div>

        {/* KYC Form */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>All documents are required for account verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Aadhaar Number */}
            <div className="space-y-2">
              <Label htmlFor="aadhaar">{t.aadhaarNumber}</Label>
              <Input
                id="aadhaar"
                type="text"
                value={kycData.aadhaarNumber}
                onChange={(e) => setKycData(prev => ({ 
                  ...prev, 
                  aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) 
                }))}
                placeholder="XXXX XXXX XXXX"
                maxLength={12}
              />
            </div>

            {/* Aadhaar Front Photo */}
            <div className="space-y-2">
              <Label>{t.frontPhoto}</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('aadhaarFront', e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadhaar-front"
                />
                <label htmlFor="aadhaar-front" className="cursor-pointer flex flex-col items-center space-y-2">
                  {kycData.aadhaarFront ? (
                    <>
                      <FileImage className="h-8 w-8 text-primary" />
                      <span className="text-sm">{kycData.aadhaarFront.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Aadhaar Front</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Aadhaar Back Photo */}
            <div className="space-y-2">
              <Label>{t.backPhoto}</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('aadhaarBack', e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadhaar-back"
                />
                <label htmlFor="aadhaar-back" className="cursor-pointer flex flex-col items-center space-y-2">
                  {kycData.aadhaarBack ? (
                    <>
                      <FileImage className="h-8 w-8 text-primary" />
                      <span className="text-sm">{kycData.aadhaarBack.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Aadhaar Back</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Farmer-specific: Land Proof */}
            {selectedRole === 'farmer' && (
              <div className="space-y-2">
                <Label>{t.landProof}</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('landProof', e.target.files?.[0] || null)}
                    className="hidden"
                    id="land-proof"
                  />
                  <label htmlFor="land-proof" className="cursor-pointer flex flex-col items-center space-y-2">
                    {kycData.landProof ? (
                      <>
                        <File className="h-8 w-8 text-primary" />
                        <span className="text-sm">{kycData.landProof.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload Land Proof</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Buyer-specific: GST */}
            {selectedRole === 'buyer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gst">{t.gstNumber}</Label>
                  <Input
                    id="gst"
                    value={kycData.gstNumber}
                    onChange={(e) => setKycData(prev => ({ 
                      ...prev, 
                      gstNumber: e.target.value.toUpperCase() 
                    }))}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.gstCertificate}</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileUpload('gstCertificate', e.target.files?.[0] || null)}
                      className="hidden"
                      id="gst-cert"
                    />
                    <label htmlFor="gst-cert" className="cursor-pointer flex flex-col items-center space-y-2">
                      {kycData.gstCertificate ? (
                        <>
                          <File className="h-8 w-8 text-primary" />
                          <span className="text-sm">{kycData.gstCertificate.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload GST Certificate</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full"
            >
              {t.submitForReview}
            </Button>

            {/* Skip Button */}
            <Button 
              onClick={handleSkip}
              variant="outline"
              className="w-full"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip for Now
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setCurrentScreen('profile-setup')}
          className="w-full"
        >
          {t.back}
        </Button>
      </div>
    </div>
  );
}