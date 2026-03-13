import { useApp } from './AppContext';
import { useTranslation } from './translations';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle, MessageCircle, RefreshCw } from 'lucide-react';

export function Header() {
  const { user, language, setLanguage, setCurrentScreen, switchRole } = useApp();
  const t = useTranslation(language);

  const handleChatClick = () => {
    // Store previous screen for proper navigation context
    sessionStorage.setItem('previousScreen', user?.role === 'farmer' ? 'farmer-home' : 'buyer-home');
    
    // For now, we'll set a default chat context or go to a chat list
    // In a real app, this could show recent conversations
    const defaultChatContext = {
      orderId: 'general-chat',
      otherParty: {
        id: 'support',
        name: 'Customer Support',
        role: user?.role === 'farmer' ? 'buyer' : 'farmer'
      }
    };
    
    sessionStorage.setItem('chatContext', JSON.stringify(defaultChatContext));
    setCurrentScreen('messaging');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Language Selector */}
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t.english}</SelectItem>
            <SelectItem value="hi">{t.hindi}</SelectItem>
            <SelectItem value="gu">{t.gujarati}</SelectItem>
          </SelectContent>
        </Select>

        {/* Logo/Title */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">🌾</span>
          <span className="text-lg font-medium text-primary">{t.appName}</span>
        </div>

        {/* Chat Icon & Switch Role & Role Badge & Verification Status */}
        <div className="flex items-center space-x-2">
          {/* Chat Icon - Only show for authenticated users */}
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleChatClick}
              className="relative h-9 w-9 p-0"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              {/* Optional: Add notification dot for unread messages */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full opacity-0"></div>
            </Button>
          )}

          {/* Switch Role Button - For MVP Testing */}
          {user && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={switchRole}
              className="h-9 px-2"
              title="Switch Role (MVP Testing)"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {/* Role Badge & Verification Status */}
          {user && (
            <div className="flex items-center space-x-2">
              {user.isVerified && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
              <Badge 
                variant={user.role === 'farmer' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {user.role === 'farmer' ? t.farmer : t.buyer}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}