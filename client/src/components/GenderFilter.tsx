import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, User, Crown, Sparkles, CheckCircle } from "lucide-react";

interface GenderFilterProps {
  isPremium: boolean;
  onGenderSelect: (gender: string) => void;
  onUpgrade: () => void;
}

export default function GenderFilter({
  isPremium,
  onGenderSelect,
  onUpgrade,
}: GenderFilterProps) {
  const [selectedGender, setSelectedGender] = useState<string>("any");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const genderOptions = [
    {
      id: "any",
      label: "Anyone",
      icon: Users,
      description: "Connect with all genders",
      emoji: "👥",
    },
    {
      id: "male",
      label: "Male",
      icon: User,
      description: "Connect with males only",
      emoji: "👨",
    },
    {
      id: "female",
      label: "Female",
      icon: User,
      description: "Connect with females only",
      emoji: "👩",
    },
  ];

  const handleGenderChange = (gender: string) => {
    if (!isPremium && gender !== "any") {
      onUpgrade();
      return;
    }
    setSelectedGender(gender);
    onGenderSelect(gender);
    
    // Show toast notification
    const selectedOption = genderOptions.find(option => option.id === gender);
    if (selectedOption) {
      setToastMessage(`Gender preference set to: ${selectedOption.label}`);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#FFB6B9' }}>
      <CardHeader className="pb-2 sm:pb-3 rounded-t-lg px-3 sm:px-6 py-3 sm:py-4" style={{ background: `linear-gradient(to right, rgba(255, 182, 185, 0.3), rgba(255, 255, 255, 0.5))` }}>
        <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: '#F44B7F' }}>
          <Users className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#F44B7F' }} />
          Gender Preference
          {!isPremium && (
            <Crown className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#F7C773' }} />
          )}
        </CardTitle>
      </CardHeader>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className="text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border" style={{ backgroundColor: '#22c55e', borderColor: '#16a34a' }}>
            <CheckCircle className="h-4 w-4" style={{ color: '#FFFFFF' }} />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {genderOptions.map((option) => {
            const isLocked = !isPremium && option.id !== "any";

            return (
              <Button
                key={option.id}
                variant={selectedGender === option.id ? "default" : "outline"}
                className={`group justify-start h-auto p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  selectedGender === option.id
                    ? "text-white shadow-2xl scale-105 animate-pulse"
                    : "hover:bg-opacity-50"
                } ${isLocked ? "opacity-60" : ""}`}
                style={selectedGender === option.id ? {
                  background: `linear-gradient(to right, #F44B7F, #FFB6B9)`,
                  borderColor: '#F44B7F'
                } : {
                  backgroundColor: 'rgba(255, 182, 185, 0.1)',
                  borderColor: '#FFB6B9'
                }}
                onClick={() => handleGenderChange(option.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-200">{option.emoji}</span>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">{option.label}</div>
                    <div className="text-sm opacity-75 mt-1" style={{ color: selectedGender === option.id ? '#FFFFFF' : '#2FF2FF' }}>
                      {option.description}
                    </div>
                  </div>
                  {isLocked && <Crown className="h-5 w-5 animate-pulse" style={{ color: '#F7C773' }} />}
                  {selectedGender === option.id && (
                    <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#FFFFFF' }}></div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {!isPremium && (
          <div className="mt-6 p-6 rounded-2xl text-center border-2 shadow-xl relative overflow-hidden" style={{ 
            background: `linear-gradient(to bottom right, rgba(142, 68, 173, 0.1), rgba(255, 182, 185, 0.1), rgba(244, 75, 127, 0.1))`,
            borderColor: '#8E44AD'
          }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 animate-pulse" style={{ background: `linear-gradient(to right, rgba(142, 68, 173, 0.3), rgba(255, 182, 185, 0.3), rgba(244, 75, 127, 0.3))` }}></div>
            <div className="absolute top-2 right-2 text-2xl animate-bounce" style={{ color: '#F7C773' }}>👑</div>
            <div className="absolute bottom-2 left-2 text-xl animate-pulse" style={{ color: '#F7C773' }}>✨</div>
            
            <div className="relative z-10">
              <div className="text-3xl mb-3 animate-bounce" style={{ color: '#8E44AD' }}>🎯</div>
              <p className="text-base mb-4 font-bold" style={{ color: '#8E44AD' }}>
                Unlock Gender Filtering with Premium!
              </p>
              <p className="text-sm mb-4 font-medium" style={{ color: '#2FF2FF' }}>
                Choose exactly who you want to meet and connect with
              </p>
              <Button
                onClick={onUpgrade}
                className="text-white rounded-full px-8 py-3 shadow-lg transform hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none font-bold"
                style={{ background: `linear-gradient(to right, #8E44AD, #F44B7F)` }}
              >
                <Crown className="h-5 w-5 mr-2" style={{ color: '#FFFFFF' }} />
                Upgrade to Premium
                <Sparkles className="h-4 w-4 ml-2" style={{ color: '#FFFFFF' }} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
