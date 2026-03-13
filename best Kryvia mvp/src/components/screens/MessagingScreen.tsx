import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ArrowLeft, Send, Phone, Video, Paperclip, Mic, MoreVertical, Search, Plus } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio' | 'system';
  orderId?: string;
}

interface ChatContext {
  orderId: string;
  otherParty: {
    id: string;
    name: string;
    role: 'farmer' | 'buyer';
  };
}

interface Conversation {
  id: string;
  otherParty: {
    id: string;
    name: string;
    role: 'farmer' | 'buyer';
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
}

export function MessagingScreen() {
  const { user, orders, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [conversations] = useState<Conversation[]>([]);
  const [chatContext, setChatContext] = useState<ChatContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get chat context from session storage once on mount
  useEffect(() => {
    const chatContextStr = sessionStorage.getItem('chatContext');
    const context: ChatContext | null = chatContextStr ? JSON.parse(chatContextStr) : null;
    setChatContext(context);
  }, []); // Only run once on mount

  // Generate conversations based on user's orders
  useEffect(() => {
    if (user) {
      const userOrders = user.role === 'farmer' 
        ? orders.filter(order => order.farmerId === user.id)
        : orders.filter(order => order.buyerId === user.id);

      const mockConversations: Conversation[] = userOrders.slice(0, 5).map(order => ({
        id: `conv-${order.id}`,
        otherParty: {
          id: user.role === 'farmer' ? order.buyerId : order.farmerId,
          name: user.role === 'farmer' ? order.buyerName : order.farmerName,
          role: user.role === 'farmer' ? 'buyer' : 'farmer'
        },
        lastMessage: user.role === 'farmer' 
          ? 'When can you ship the order?' 
          : 'Is the crop ready for harvest?',
        lastMessageTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        unreadCount: Math.floor(Math.random() * 3),
        orderId: order.id
      }));

      // Add general support conversation
      mockConversations.unshift({
        id: 'support-chat',
        otherParty: {
          id: 'support',
          name: 'KryVia Support',
          role: user.role === 'farmer' ? 'buyer' : 'farmer'
        },
        lastMessage: 'How can we help you today?',
        lastMessageTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        unreadCount: 0
      });

      // Set conversations would go here in a real app
      // setConversations(mockConversations);
    }
  }, [user, orders]);

  useEffect(() => {
    // If we have a specific chat context, load that conversation
    if (chatContext && user) {
      setShowConversationList(false);
      
      // Load chat messages
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'system',
          senderName: 'System',
          content: chatContext.orderId === 'general-chat' 
            ? 'Chat with KryVia Support' 
            : `Chat started for Order #${chatContext.orderId.slice(-6)}`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'system'
        },
        {
          id: '2',
          senderId: chatContext.otherParty.id,
          senderName: chatContext.otherParty.name,
          content: chatContext.orderId === 'general-chat'
            ? 'Hello! How can I help you today?'
            : 'Hello! I have some questions about your order.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'text'
        },
        {
          id: '3',
          senderId: user.id,
          senderName: user.name,
          content: 'Hi there! Thanks for reaching out.',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    } else if (!chatContext) {
      setShowConversationList(true);
    }
  }, [chatContext, user]); // Dependencies are now properly managed

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user?.id || 'me',
        senderName: user?.name || 'Me',
        content: message.trim(),
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate typing indicator and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: chatContext?.otherParty.id || 'other',
          senderName: chatContext?.otherParty.name || 'Other User',
          content: getAutoResponse(message.trim()),
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const getAutoResponse = (userMessage: string): string => {
    const responses = [
      'Thank you for your message. I\'ll get back to you shortly.',
      'Got it! Let me check on that for you.',
      'I appreciate your patience. I\'ll have an update soon.',
      'Perfect! I\'ll arrange that right away.',
      'No problem at all. Happy to help!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleBack = () => {
    if (!showConversationList && chatContext) {
      // Go back to conversation list
      setShowConversationList(true);
      sessionStorage.removeItem('chatContext');
    } else {
      // Go back to previous screen
      setCurrentScreen(sessionStorage.getItem('previousScreen') || (user?.role === 'farmer' ? 'farmer-home' : 'buyer-home'));
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    const newChatContext: ChatContext = {
      orderId: conversation.orderId || 'general-chat',
      otherParty: conversation.otherParty
    };
    sessionStorage.setItem('chatContext', JSON.stringify(newChatContext));
    setShowConversationList(false);
    // This will trigger the useEffect to load messages
    window.location.reload(); // Simple way to reload with new context
  };

  const handleCall = () => {
    alert(`Calling ${chatContext?.otherParty.name}...`);
  };

  const handleVideoCall = () => {
    alert(`Starting video call with ${chatContext?.otherParty.name}...`);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const isMyMessage = (senderId: string) => senderId === user?.id;

  // Conversation List View
  if (showConversationList) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="font-medium">💬 Messages</h1>
              <p className="text-sm text-muted-foreground">Your conversations</p>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">💬</div>
                  <div>
                    <h3 className="font-medium">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start chatting with {user?.role === 'farmer' ? 'buyers' : 'farmers'} through your orders
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Card 
                  key={conversation.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleConversationClick(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium flex-shrink-0">
                        {conversation.otherParty.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{conversation.otherParty.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatConversationTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {conversation.otherParty.role}
                          </Badge>
                          {conversation.orderId && conversation.orderId !== 'general-chat' && (
                            <Badge variant="secondary" className="text-xs">
                              Order #{conversation.orderId.slice(-6)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Individual Chat View
  if (!chatContext) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="font-medium">Chat not available</h3>
            <p className="text-sm text-muted-foreground">Unable to load chat context</p>
            <Button onClick={handleBack} className="mt-4">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              {chatContext.otherParty.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-medium">{chatContext.otherParty.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {chatContext.otherParty.role}
                {chatContext.orderId !== 'general-chat' && (
                  <span> • Order #{chatContext.orderId.slice(-6)}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCall}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleVideoCall}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === 'system' ? (
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  {msg.content}
                </Badge>
              </div>
            ) : (
              <div className={`flex ${isMyMessage(msg.senderId) ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] space-y-1 ${isMyMessage(msg.senderId) ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMyMessage(msg.senderId) && (
                    <p className="text-xs text-muted-foreground">{msg.senderName}</p>
                  )}
                  <div className={`p-3 rounded-lg ${
                    isMyMessage(msg.senderId) 
                      ? 'bg-primary text-primary-foreground ml-4' 
                      : 'bg-muted mr-4'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg mr-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-card border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}