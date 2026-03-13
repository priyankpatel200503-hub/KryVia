import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Upload, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ListingFormData {
  cropType: string;
  variety: string;
  grade: string;
  harvestDate: string;
  location: string;
  pricePerUnit: string;
  minOrderQty: string;
  totalAvailableQty: string;
  images: File[];
  video?: File;
  expiryDate: string;
  description: string;
}

export function CreateListingScreen() {
  const { user, addListing, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<ListingFormData>({
    cropType: '',
    variety: '',
    grade: '',
    harvestDate: '',
    location: user?.village ? `${user.village}, ${user.district}` : '',
    pricePerUnit: '',
    minOrderQty: '',
    totalAvailableQty: '',
    images: [],
    expiryDate: '',
    description: '',
  });

  const handleInputChange = (field: keyof ListingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null, type: 'images' | 'video') => {
    if (!files) return;
    
    if (type === 'images') {
      const imageFiles = Array.from(files).slice(0, 3); // Max 3 images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles].slice(0, 3) }));
    } else if (type === 'video' && files[0]) {
      setFormData(prev => ({ ...prev, video: files[0] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setCurrentScreen('farmer-home');
    }
  };

  const handlePublish = () => {
    // Create new listing
    const newListing = {
      id: Date.now().toString(),
      farmerId: user!.id,
      farmerName: user!.name,
      cropType: formData.cropType,
      variety: formData.variety,
      grade: formData.grade,
      harvestDate: formData.harvestDate,
      location: formData.location,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      minOrderQty: parseInt(formData.minOrderQty),
      totalAvailableQty: parseInt(formData.totalAvailableQty),
      images: formData.images.map((file, index) => 
        `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop&auto=format`
      ),
      video: formData.video ? 'video-url' : undefined,
      expiryDate: formData.expiryDate,
      status: 'live' as const,
      createdAt: new Date().toISOString(),
    };

    addListing(newListing);
    setCurrentScreen('farmer-home');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.cropType && formData.variety && formData.grade && formData.harvestDate && formData.location;
      case 2:
        return formData.pricePerUnit && formData.minOrderQty && formData.totalAvailableQty;
      case 3:
        return formData.images.length > 0;
      case 4:
        return formData.expiryDate;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.cropName}</Label>
              <Input
                value={formData.cropType}
                onChange={(e) => handleInputChange('cropType', e.target.value)}
                placeholder={t.enterCropName}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.variety}</Label>
              <Input
                value={formData.variety}
                onChange={(e) => handleInputChange('variety', e.target.value)}
                placeholder="Enter variety name"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.grade}</Label>
              <Select onValueChange={(value) => handleInputChange('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="grade-a">Grade A</SelectItem>
                  <SelectItem value="grade-b">Grade B</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.harvestDate}</Label>
              <Input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => handleInputChange('harvestDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.location}</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Village, District"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.pricePerUnit}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">Price per kg/quintal</p>
            </div>

            <div className="space-y-2">
              <Label>{t.minOrderQty}</Label>
              <Input
                type="number"
                value={formData.minOrderQty}
                onChange={(e) => handleInputChange('minOrderQty', e.target.value)}
                placeholder="Minimum quantity buyers can order"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.totalAvailable}</Label>
              <Input
                type="number"
                value={formData.totalAvailableQty}
                onChange={(e) => handleInputChange('totalAvailableQty', e.target.value)}
                placeholder="Total quantity available for sale"
              />
            </div>

            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Total Value: </span>
                ₹{(parseFloat(formData.pricePerUnit || '0') * parseInt(formData.totalAvailableQty || '0')).toLocaleString()}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Crop Photos (Required)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files, 'images')}
                  className="hidden"
                  id="crop-images"
                />
                <label htmlFor="crop-images" className="cursor-pointer flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Upload 1-3 photos of your crop
                  </span>
                </label>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Photos</Label>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🌾
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Optional Video (30 seconds max)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e.target.files, 'video')}
                  className="hidden"
                  id="crop-video"
                />
                <label htmlFor="crop-video" className="cursor-pointer flex flex-col items-center space-y-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.video ? formData.video.name : 'Upload video (optional)'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.expiryDate}</Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground">
                Listing will automatically expire on this date
              </p>
            </div>

            <div className="space-y-2">
              <Label>Additional Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add any additional details about your crop..."
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Preview Your Listing</h3>
              <p className="text-sm text-muted-foreground">Review all details before publishing</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🌾
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{formData.cropType} - {formData.variety}</h3>
                    <p className="text-sm text-muted-foreground">Grade: {formData.grade}</p>
                    <p className="text-lg font-medium text-primary">₹{formData.pricePerUnit}/kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <span className="ml-1">{formData.totalAvailableQty} kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min Order:</span>
                    <span className="ml-1">{formData.minOrderQty} kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Harvest:</span>
                    <span className="ml-1">{new Date(formData.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="ml-1">{new Date(formData.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground text-sm">Location:</span>
                  <span className="ml-1 text-sm">{formData.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-medium">{t.createListing}</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Progress */}
        <Progress value={(currentStep / totalSteps) * 100} className="w-full" />

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && t.cropDetails}
              {currentStep === 2 && t.pricingQuantity}
              {currentStep === 3 && t.mediaUpload}
              {currentStep === 4 && 'Expiry & Description'}
              {currentStep === 5 && t.preview}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your crop'}
              {currentStep === 2 && 'Set your pricing and quantity'}
              {currentStep === 3 && 'Add photos and videos'}
              {currentStep === 4 && 'Set expiry date and add description'}
              {currentStep === 5 && 'Review and publish your listing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {currentStep === 1 ? t.cancel : t.back}
          </Button>
          <Button 
            onClick={currentStep === totalSteps ? handlePublish : handleNext}
            disabled={!isStepValid()}
          >
            {currentStep === totalSteps ? t.publish : t.next}
            {currentStep < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}