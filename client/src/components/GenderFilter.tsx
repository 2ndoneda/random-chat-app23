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
    <Card className="w-full backdrop-blur-sm shadow-lg bg-white/90 border-blush-peach">
      <CardHeader className="pb-2 sm:pb-3 rounded-t-lg px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blush-peach/30 to-white/50">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-flamingo-pink">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-flamingo-pink" />
          Gender Preference
          {!isPremium && (
            <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-soft-gold" />
          )}
        </CardTitle>
      </CardHeader>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-coral-orange text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border border-coral-orange/50">
            <CheckCircle className="h-4 w-4 text-white" />
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
                    ? "bg-gradient-to-r from-flamingo-pink to-coral-orange text-white shadow-2xl scale-105 animate-pulse border-flamingo-pink"
                    : "hover:bg-opacity-50"
                } ${isLocked ? "opacity-60" : ""} ${
                  selectedGender !== option.id ? "bg-blush-peach/10 border-blush-peach" : ""
                }`}
                onClick={() => handleGenderChange(option.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-200">{option.emoji}</span>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">{option.label}</div>
                    <div className={`text-sm opacity-75 mt-1 ${
                      selectedGender === option.id ? 'text-white' : 'text-gunmetal-gray'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                  {isLocked && <Crown className="h-5 w-5 animate-pulse text-soft-gold" />}
                  {selectedGender === option.id && (
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {!isPremium && (
          <div className="mt-6 p-6 rounded-2xl text-center border-2 border-royal-violet/30 bg-gradient-to-br from-royal-violet/10 via-blush-peach/10 to-flamingo-pink/10 shadow-xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-royal-violet/20 via-blush-peach/20 to-flamingo-pink/20 animate-pulse"></div>
            <div className="absolute top-2 right-2 text-2xl text-soft-gold animate-bounce">👑</div>
            <div className="absolute bottom-2 left-2 text-xl text-soft-gold animate-pulse">✨</div>
            
            <div className="relative z-10">
              <div className="text-3xl mb-3 text-royal-violet animate-bounce">🎯</div>
              <p className="text-base mb-4 font-bold text-royal-violet">
                Unlock Gender Filtering with Premium!
              </p>
              <p className="text-sm mb-4 font-medium text-gunmetal-gray">
                Choose exactly who you want to meet and connect with
              </p>
              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-royal-violet to-flamingo-pink text-white rounded-full px-8 py-3 shadow-lg transform hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none font-bold"
              >
                <Crown className="h-5 w-5 mr-2 text-white" />
                Upgrade to Premium
                <Sparkles className="h-4 w-4 ml-2 text-white" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
