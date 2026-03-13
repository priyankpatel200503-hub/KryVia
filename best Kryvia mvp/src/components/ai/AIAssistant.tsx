import { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { GeminiService } from '../../lib/gemini-service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AIAssistant() {
  const { user, language } = useApp();
  const t = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: `Hello ${user?.name || 'there'}! 👋 I'm your AI Assistant powered by KryVia Intelligence. I can help you with:

• Registration & KYC
• Orders & Payments
• Pricing Strategies
• Market Insights
• Platform Features

How can I assist you today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userInput = input.trim();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get conversation history in the correct format
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call Gemini API with user context
      const response = await GeminiService.sendMessage(
        userInput,
        history,
        user?.role || 'buyer',
        {
          name: user?.name,
          state: user?.state,
          district: user?.district,
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ AI is temporarily unavailable, please try again later. The chatbot will still work with intelligent responses in demo mode.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    t.howToRegister,
    t.whatIsTrustScore,
    t.howToPlaceOrder,
    t.pricingHelp,
    t.kycVerification,
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        size="icon"
      >
        <div className="relative">
          <Bot className="h-6 w-6" />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400" />
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] shadow-2xl rounded-lg overflow-hidden z-50 flex flex-col bg-background border">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="h-6 w-6" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-base">{t.aiAssistant}</CardTitle>
              <p className="text-xs opacity-90">{t.poweredByAI}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background border shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg p-3 bg-background border shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t bg-background flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(q)}
                className="text-xs h-7"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.typeYourQuestion}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center space-x-1">
          <Sparkles className="h-3 w-3" />
          <span>{t.aiPoweredAssistance}</span>
        </p>
      </div>
    </div>
  );
}