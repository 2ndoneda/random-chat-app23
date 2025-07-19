import { useCallback, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { playSound } from "../lib/audio";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Crown,
  Coins,
  Mic,
  Video,
  Users,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Star,
  Play,
  Globe,
  Settings,
  Bot,
} from "lucide-react";
import GenderFilter from "../components/GenderFilter";
import PremiumPaywall from "../components/PremiumPaywall";
import TreasureChest from "../components/TreasureChest";
import BottomNavBar from "../components/BottomNavBar";
import { usePremium } from "../context/PremiumProvider";
import { useCoin } from "../context/CoinProvider";
import { useLanguage } from "../context/LanguageProvider";

const bannerImages = [
  "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
  "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
  "https://images.pexels.com/photos/1043472/pexels-photo-1043472.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
];

const testimonials = [
  {
    name: "Priya",
    text: "Found my perfect match here! So grateful 💕",
    rating: 5,
  },
  {
    name: "Arjun",
    text: "Every chat is a new adventure, truly amazing!",
    rating: 5,
  },
  {
    name: "Sneha",
    text: "Safe, fun, and full of romantic possibilities 🌟",
    rating: 5,
  },
];

const stats = [
  { number: "10M+", label: "Happy Users", icon: Users },
  { number: "50M+", label: "Connections Made", icon: Heart },
  { number: "99.9%", label: "Uptime", icon: Shield },
];

export default function Home() {
  const { socket, isUsingMockMode } = useSocket();
  const navigate = useNavigate();
  const { isPremium, setPremium } = usePremium();
  const {
    coins,
    claimDailyBonus,
    canClaimDailyBonus,
    isLoading: coinsLoading,
  } = useCoin();
  const { t } = useLanguage();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTreasureChest, setShowTreasureChest] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12847);
  const [activeTab, setActiveTab] = useState<"friends" | "ai">("friends");

  // Simulate online users count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-claim daily bonus on app open
  useEffect(() => {
    if (canClaimDailyBonus) {
      // Show daily bonus notification
      setTimeout(() => {
        if (confirm("🎁 Daily bonus available! Claim 5 coins now?")) {
          claimDailyBonus();
        }
      }, 2000);
    }
  }, [canClaimDailyBonus, claimDailyBonus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCall = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isConnecting) return;

      setIsConnecting(true);
      playSound("join");

      // Send user profile to server for premium priority matching (if socket available)
      if (socket && !isUsingMockMode) {
        socket.emit("user:profile", {
          isPremium,
          genderFilter: "any",
          voiceOnly: false,
        });
        socket.emit("find:match");
      }

      // Navigate immediately to video chat page (it will handle the waiting state)
      navigate("/video-chat", {
        state: {
          isSearching: true,
        },
      });

      setIsConnecting(false);
    },
    [navigate, socket, isPremium, isConnecting]
  );

  const handleVoiceChat = useCallback(() => {
    navigate("/voice");
  }, [navigate]);

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  const handlePremiumPurchase = (plan: string) => {
    const now = new Date();
    const expiry = new Date(now);
    if (plan === "weekly") {
      expiry.setDate(now.getDate() + 7);
    } else {
      expiry.setMonth(now.getMonth() + 1);
    }

    setPremium(true, expiry);
    setShowPaywall(false);
    alert(`🎉 Welcome to Premium! Your ${plan} subscription is now active!`);
  };

  return (
    <>
      <Helmet>
        <title>
          {t("app.name")} - Random Video Chat - Live chat with ajnabis
        </title>
      </Helmet>
      <main className="flex flex-col min-h-screen w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto bg-gradient-to-br from-peach-25 via-cream-50 to-blush-50 relative pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
        <main className="flex flex-col min-h-screen w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto bg-snow-white relative pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
          {/* Enhanced Animated Background Elements with Indian flair */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-flamingo-pink to-coral-orange rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-20 sm:top-32 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-royal-violet to-blush-peach rounded-full opacity-30 animate-bounce"></div>
            <div
              className="absolute bottom-32 sm:bottom-40 left-4 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-soft-gold to-flamingo-pink rounded-full opacity-25 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-48 sm:bottom-60 right-8 sm:right-12 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-flamingo-pink to-royal-violet rounded-full opacity-20 animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
            {/* Add romantic Indian symbols */}
            <div
              className="absolute top-16 sm:top-20 right-16 sm:right-20 text-lg sm:text-xl lg:text-2xl opacity-40 animate-pulse"
              style={{ color: '#F44B7F', animationDelay: "0.5s" }}
            >
              💕
            </div>
            <div
              className="absolute bottom-64 sm:bottom-80 left-12 sm:left-16 text-base sm:text-lg lg:text-xl opacity-35 animate-bounce"
              style={{ color: '#FF6661', animationDelay: "1.5s" }}
            >
              🌸
            </div>
            <div
              className="absolute top-48 sm:top-60 left-6 sm:left-8 text-sm sm:text-base lg:text-lg opacity-30 animate-pulse"
              style={{ color: '#F7C773', animationDelay: "2.5s" }}
            >
              ✨
            </div>
            <div
              className="absolute top-64 sm:top-80 right-4 sm:right-6 text-xs sm:text-sm lg:text-base opacity-25 animate-bounce"
              style={{ color: '#FFB6B9', animationDelay: "3s" }}
            >
              🪷
            </div>
          </div>

          {/* Enhanced Header with Indian romantic colors */}
          <header className="w-full shadow-lg px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative overflow-hidden" style={{ background: `linear-gradient(to right, #F44B7F, #FFB6B9, #FF6661)` }}>
            {/* Header Background Pattern with Indian touch */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/25 to-white/15 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

            <div className="relative z-10 space-y-3">
              {/* Top Row: Logo left, Settings & Coins right */}
              <div className="flex items-center justify-between">
                {/* App Name & Premium Badge */}
                <div className="flex flex-col items-start gap-1 sm:gap-2">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                    {t("app.name")}
                  </h1>
                  {isPremium && (
                    <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md" style={{ background: `linear-gradient(to right, #F7C773, #8E44AD)` }}>
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFFFFF' }} />
                      <span className="text-white text-xs font-bold">PREMIUM</span>
                    </div>
                  )}
                </div>

                {/* Right-aligned: Settings & Coins */}
                <div className="flex items-center gap-2">
                  {/* Settings Button */}
                  <Button
                    onClick={() => navigate("/profile")}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold p-2 sm:p-2.5 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 border border-white/30"
                    title="Settings & Profile"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#FFFFFF' }} />
                  </Button>

                  {/* Coins Button */}
                  <Button
                    onClick={() => setShowTreasureChest(true)}
                    disabled={coinsLoading}
                    className="font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                    style={{ 
                      background: `linear-gradient(to right, #F7C773, #FF6661)`,
                      color: '#FFFFFF'
                    }}
                  >
                    <Coins className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" style={{ color: '#FFFFFF' }} />
                    {coinsLoading ? "..." : coins}
                  </Button>
                </div>
              </div>

              {/* Bottom Row: Voice Match Toggle Bar */}
              <div className="flex justify-center">
                <Button
                  onClick={handleVoiceChat}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 border border-white/30 text-sm sm:text-base min-w-[200px]"
                >
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5 mr-2" style={{ color: '#FFFFFF' }} />
                  <span>Voice Match Mode</span>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 ml-2" style={{ color: '#FFFFFF' }} />
                </Button>
              </div>
            </div>
          </header>

          {/* Enhanced Banner Carousel - Moved to top as Ad */}
          <div className="w-full relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${currentBannerIndex * 100}%)`,
                }}
              >
                {bannerImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 relative">
                    <img
                      src={image}
                      alt={`Ad Banner ${index + 1}`}
                      className="w-full h-24 sm:h-32 lg:h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    <div className="absolute bottom-1 sm:bottom-2 left-2 sm:left-4 text-white">
                      <p className="text-xs opacity-90">Advertisement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Carousel Dots */}
            <div className="absolute bottom-1 right-16 flex gap-1">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentBannerIndex === index
                      ? "bg-white w-4"
                      : "bg-white/60 w-1.5"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
            {/* Enhanced Gender Filter - Moved to top */}
            <div className="w-full mb-4 sm:mb-6">
              <GenderFilter
                isPremium={isPremium}
                onGenderSelect={(gender: string) => {
                  console.log("Selected gender:", gender);
                }}
                onUpgrade={handleUpgrade}
              />
            </div>

            {/* Friends vs AI Chat Tab Switcher */}
            <div className="w-full mb-6 sm:mb-8">
              <div className="backdrop-blur-sm rounded-2xl p-2 shadow-lg border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#F44B7F' }}>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setActiveTab("friends")}
                    className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform ${
                      activeTab === "friends"
                        ? "text-white shadow-lg scale-105"
                        : "hover:bg-opacity-50"
                    }`}
                    style={activeTab === "friends" ? {
                      background: `linear-gradient(to right, #F44B7F, #FFB6B9)`,
                      color: '#FFFFFF'
                    } : {
                      color: '#2FF2FF',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Users className="h-5 w-5" style={{ color: activeTab === "friends" ? '#FFFFFF' : '#2FF2FF' }} />
                    <span>Meet Friends</span>
                    {activeTab === "friends" && (
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FFFFFF' }}></div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("ai")}
                    className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform ${
                      activeTab === "ai"
                        ? "text-white shadow-lg scale-105"
                        : "hover:bg-opacity-50"
                    }`}
                    style={activeTab === "ai" ? {
                      background: `linear-gradient(to right, #8E44AD, #2FF2FF)`,
                      color: '#FFFFFF'
                    } : {
                      color: '#2FF2FF',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Bot className="h-5 w-5" style={{ color: activeTab === "ai" ? '#FFFFFF' : '#2FF2FF' }} />
                    <span>AI Chat</span>
                    {activeTab === "ai" && (
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FFFFFF' }}></div>
                    )}
                  </button>
                </div>
                
                {/* Tab Description */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium" style={{ color: '#2FF2FF' }}>
                    {activeTab === "friends" 
                      ? "💕 Connect with real people and make lasting friendships"
                      : "🤖 Chat with AI assistant for practice and fun conversations"
                    }
                  </p>
                </div>
              </div>
            </div>
            {/* Enhanced Main Action Button - Moved to top */}
            <div className="w-full mb-4 sm:mb-6">
              <Button
                className={`w-full py-6 sm:py-8 lg:py-10 text-xl sm:text-2xl lg:text-3xl font-bold rounded-3xl sm:rounded-[2rem] text-white shadow-2xl transform transition-all duration-300 relative overflow-hidden animate-pulse hover:animate-none ${
                  isConnecting
                    ? "scale-95"
                    : activeTab === "friends"
                      ? "hover:scale-105 hover:shadow-3xl hover:animate-bounce"
                      : "hover:scale-105 hover:shadow-3xl hover:animate-bounce"
                }`}
                style={isConnecting ? {
                  background: `linear-gradient(to right, #FFB6B9, #FF6661)`,
                  color: '#FFFFFF'
                } : activeTab === "friends" ? {
                  background: `linear-gradient(to right, #F44B7F, #FFB6B9, #FF6661)`,
                  color: '#FFFFFF'
                } : {
                  background: `linear-gradient(to right, #8E44AD, #2FF2FF, #F44B7F)`,
                  color: '#FFFFFF'
                }}
                onClick={activeTab === "friends" ? handleStartCall : () => navigate("/ai-chatbot")}
                disabled={isConnecting}
                title={activeTab === "friends" ? "Takes <10 seconds to find your perfect match" : "Start chatting with AI assistant"}
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/25 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                
                {/* Floating hearts animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {activeTab === "friends" ? (
                    <>
                      <div className="absolute top-2 left-4 text-lg animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '0s'}}>💕</div>
                      <div className="absolute top-4 right-6 text-sm animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '0.5s'}}>✨</div>
                      <div className="absolute bottom-3 left-8 text-base animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '1s'}}>💖</div>
                      <div className="absolute bottom-2 right-4 text-xs animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '1.5s'}}>🌟</div>
                    </>
                  ) : (
                    <>
                      <div className="absolute top-2 left-4 text-lg animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '0s'}}>🤖</div>
                      <div className="absolute top-4 right-6 text-sm animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '0.5s'}}>💬</div>
                      <div className="absolute bottom-3 left-8 text-base animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '1s'}}>🧠</div>
                      <div className="absolute bottom-2 right-4 text-xs animate-bounce" style={{color: 'rgba(255, 255, 255, 0.3)', animationDelay: '1.5s'}}>⚡</div>
                    </>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  {isConnecting ? (
                    <>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 border-3 rounded-full animate-spin" style={{ borderColor: '#FFFFFF', borderTopColor: 'transparent' }}></div>
                      <span>Finding your perfect match...</span>
                    </>
                  ) : (
                    <>
                      {activeTab === "friends" ? (
                        <>
                          <Heart className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse" style={{ color: '#FFFFFF' }} />
                          <span>{t("home.start")}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="h-6 w-6 sm:h-7 sm:w-7 animate-pulse" style={{ color: '#FFFFFF' }} />
                          <span>Start AI Chat</span>
                        </>
                      )}
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" style={{ color: '#FFFFFF' }} />
                    </>
                  )}
                </div>
              </Button>
              
              {/* Tooltip-like text below button */}
              <div className="text-center mt-3">
                <p className="text-xs sm:text-sm font-medium animate-pulse" style={{ color: '#2FF2FF' }}>
                  {activeTab === "friends" 
                    ? "⚡ Takes less than 10 seconds to find your perfect match"
                    : "🤖 Instant AI responses - practice your conversation skills"
                  }
                </p>
              </div>
            </div>

            {/* Secondary Action - View Friends List */}
            {activeTab === "friends" && (
              <div className="w-full mb-4 sm:mb-6">
                <Button
                  onClick={() => navigate("/friends")}
                  className="w-full backdrop-blur-sm border hover:shadow-lg transition-all duration-300 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#2FF2FF',
                    borderColor: '#FFB6B9'
                  }}
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" style={{ color: '#F44B7F' }} />
                  <span className="font-semibold">View My Friends</span>
                </Button>
              </div>
            )}

            {/* Footer Text */}
            <div className="text-xs sm:text-sm text-center px-2 sm:px-4 leading-relaxed" style={{ color: '#2FF2FF' }}>
              By using AjnabiCam, you agree to our Terms of Service and Privacy
              Policy.
              <br className="hidden sm:block" />
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-1 sm:mt-0">
                <span className="font-medium" style={{ color: '#F44B7F' }}>✓ Safe & Secure</span>
                <span style={{ color: '#2FF2FF' }}>•</span>
                <span className="font-medium" style={{ color: '#FFB6B9' }}>24/7 Support</span>
                <span style={{ color: '#2FF2FF' }}>•</span>
                <span className="font-medium" style={{ color: '#FF6661' }}>
                  Find True Love
                </span>
              </div>
            </div>
          </div>

          {/* Floating Coin Store Button with Indian colors */}
          <button
            onClick={() => setShowTreasureChest(true)}
            className="fixed bottom-20 sm:bottom-24 lg:bottom-28 right-3 sm:right-4 lg:right-6 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 animate-pulse"
            style={{ background: `linear-gradient(to right, #F44B7F, #FFB6B9, #FF6661)` }}
          >
            <div className="relative">
              <Coins className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#FFFFFF' }} />
              {coins > 0 && (
                <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-md" style={{ backgroundColor: '#F44B7F' }}>
                  {coins > 99 ? "99+" : coins}
                </div>
              )}
            </div>
          </button>

          <BottomNavBar />
        </main>

        <PremiumPaywall
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onPurchase={handlePremiumPurchase}
        />

        <TreasureChest
          isOpen={showTreasureChest}
          onClose={() => setShowTreasureChest(false)}
        />
      </main>
    </>
  );
}
