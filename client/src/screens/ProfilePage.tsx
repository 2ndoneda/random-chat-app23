import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BottomNavBar from "../components/BottomNavBar";
import PremiumPaywall from "../components/PremiumPaywall";
import LanguageSelector from "../components/LanguageSelector";
import SettingsModal from "../components/SettingsModal";
import HelpSupportModal from "../components/HelpSupportModal";

import { useFriends } from "../context/FriendsProvider";
import { useCoin } from "../context/CoinProvider";
import {
  uploadProfileImage,
  getStorageErrorMessage,
  validateImageFile,
} from "../lib/storageUtils";
import { getUserId, getUserProfile, saveUserProfile } from "../lib/userUtils";
import {
  Crown,
  Camera,
  Copy,
  Star,
  Gift,
  ArrowLeft,
  Edit3,
  Check,
  Settings,
  User,
  Globe,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  AlertCircle,
  Trash2,
  Download,
  Share2,
  Heart,
  Database,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  Medal,
  Coins,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { usePremium } from "../context/PremiumProvider";
import { useLanguage } from "../context/LanguageProvider";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { friends, removeFriend, canAddMoreFriends, maxFreeLimit } =
    useFriends();
  const { isPremium, setPremium, premiumExpiry } = usePremium();
  const { coins, isLoading: coinsLoading } = useCoin();
  const { t } = useLanguage();

  const [username, setUsername] = useState<string>("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string>("other");
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showLanguageSelector, setShowLanguageSelector] =
    useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [settingsType, setSettingsType] = useState<
    "privacy" | "notifications" | "account" | "general" | null
  >(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "profile" | "stats" | "achievements"
  >("profile");

  const referralId = "AJNABICAM12345";

  // Mock user stats
  const userStats = {
    totalChats: 127,
    friendsMade: 23,
    hoursSpent: 45,
    favoriteTime: "Evening",
    joinDate: "Dec 2024",
    streak: 7,
  };

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: "First Chat",
      description: "Complete your first video chat",
      unlocked: true,
      icon: "🎉",
    },
    {
      id: 2,
      title: "Social Butterfly",
      description: "Make 10 friends",
      unlocked: true,
      icon: "🦋",
    },
    {
      id: 3,
      title: "Night Owl",
      description: "Chat after midnight 5 times",
      unlocked: true,
      icon: "🦉",
    },
    {
      id: 4,
      title: "Premium Member",
      description: "Subscribe to Premium",
      unlocked: isPremium,
      icon: "👑",
    },
    {
      id: 5,
      title: "Conversation Master",
      description: "Have 100 chats",
      unlocked: true,
      icon: "💬",
    },
    {
      id: 6,
      title: "Global Connector",
      description: "Chat with people from 10 countries",
      unlocked: false,
      icon: "🌍",
    },
  ];

  // Gender-specific avatar URLs
  const getDefaultAvatar = (gender: string): string => {
    switch (gender) {
      case "male":
        return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
      case "female":
        return "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
      default:
        return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
    }
  };

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("ajnabicam_user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.username) {
          setUsername(parsedData.username);
        }
        if (parsedData.gender) {
          setUserGender(parsedData.gender);
        }

        const savedProfileImage = localStorage.getItem(
          "ajnabicam_profile_image",
        );
        if (savedProfileImage) {
          setProfileImage(savedProfileImage);
        } else {
          setProfileImage(getDefaultAvatar(parsedData.gender || "other"));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setProfileImage(getDefaultAvatar("other"));
      }
    } else {
      setProfileImage(getDefaultAvatar("other"));
    }
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    // Create preview immediately for better UX
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfileImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      // Get user ID
      const userId = getUserId();

      // Upload to Firebase Storage
      const result = await uploadProfileImage(file, userId, (progress) =>
        setUploadProgress(progress),
      );

      // Save the Firebase Storage URL
      setProfileImage(result.url);
      localStorage.setItem("ajnabicam_profile_image", result.url);
      localStorage.setItem("ajnabicam_profile_path", result.path);

      console.log("Profile image uploaded successfully:", result.url);
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      const errorMessage = getStorageErrorMessage(error);
      setUploadError(errorMessage);

      // Revert to previous image on error
      const previousImage = localStorage.getItem("ajnabicam_profile_image");
      if (previousImage) {
        setProfileImage(previousImage);
      } else {
        setProfileImage(getDefaultAvatar(userGender));
      }
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameSave = () => {
    setIsEditingUsername(false);

    const userData = localStorage.getItem("ajnabicam_user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        parsedData.username = username;
        localStorage.setItem("ajnabicam_user_data", JSON.stringify(parsedData));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handlePremiumClick = () => {
    setShowPaywall(true);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralId);
    alert(t("profile.referral.copy") + "!");
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

  const handleSettingsClick = (
    type: "privacy" | "notifications" | "account" | "general",
  ) => {
    setSettingsType(type);
    setShowSettingsModal(true);
  };

  const formatPremiumExpiry = () => {
    if (!premiumExpiry) return "";
    return premiumExpiry.toLocaleDateString();
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Enhanced Profile Image Section */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          {/* Larger circular profile image with matching colors */}
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-flamingo-pink/20 via-blush-peach/30 to-coral-orange/20 flex justify-center items-center overflow-hidden cursor-pointer border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative">
            {/* Animated border ring matching home colors */}
            <div className="absolute inset-0 rounded-full border-4 border-flamingo-pink/40 animate-pulse opacity-40"></div>

            {/* Premium glow effect for premium users */}
            {isPremium && (
              <div className="absolute inset-0 rounded-full border-4 border-soft-gold/60 animate-pulse shadow-[0_0_25px_rgba(247,199,115,0.7)]"></div>
            )}

            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <div className="text-flamingo-pink text-xs font-bold text-center">
                  {t("profile.addPhoto")}
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-8 w-8 mx-auto mb-1" />
                <div className="text-xs font-semibold">Change Photo</div>
              </div>
            </div>
          </div>

          {/* Camera button with home screen colors */}
          <button
            onClick={handleImageUploadClick}
            className={`absolute -bottom-2 -right-2 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
              isPremium
                ? "bg-gradient-to-r from-soft-gold to-coral-orange"
                : "bg-gradient-to-r from-flamingo-pink to-blush-peach"
            }`}
          >
            <Camera className="h-5 w-5" />
          </button>

          {/* Premium crown indicator */}
          {isPremium && (
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-soft-gold to-coral-orange rounded-full p-2 shadow-lg animate-bounce">
              <Crown className="h-5 w-5 text-white" />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploadingImage}
          />

          {/* Upload Progress */}
          {isUploadingImage && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-xs font-semibold">
                  Uploading {Math.round(uploadProgress)}%
                </div>
                {uploadProgress > 0 && (
                  <div className="w-16 bg-white/30 rounded-full h-1.5 mt-1 mx-auto">
                    <div
                      className="bg-gradient-to-r from-flamingo-pink to-coral-orange h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-4 w-full max-w-sm bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-red-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-red-800 text-sm">
                  Upload Failed
                </h4>
                <p className="text-red-700 text-xs mt-1">{uploadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Username Section with home screen colors */}
        <div className="mt-6 w-full max-w-sm">
          {isEditingUsername ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="flex-grow px-4 py-3 rounded-xl border-2 border-flamingo-pink/30 focus:outline-none focus:ring-2 focus:ring-flamingo-pink/40 focus:border-flamingo-pink/50 bg-flamingo-pink/5 text-lg font-semibold transition-all duration-200"
                autoFocus
              />
              <Button
                onClick={handleUsernameSave}
                className="bg-gradient-to-r from-soft-gold to-coral-orange text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-grow text-center px-4 py-3 rounded-xl bg-gradient-to-r from-flamingo-pink/10 to-blush-peach/10 text-gunmetal-gray font-bold text-xl border-2 border-flamingo-pink/20 shadow-sm">
                {username}
              </div>
              <Button
                onClick={() => setIsEditingUsername(true)}
                className="bg-gradient-to-r from-royal-violet to-flamingo-pink text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* User Level Badge with home colors */}
        <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-royal-violet/10 to-flamingo-pink/10 px-4 py-2 rounded-full border border-royal-violet/20 shadow-md">
          <Medal className="h-5 w-5 text-royal-violet" />
          <span className="text-royal-violet font-semibold">Level 5 Chatter</span>
        </div>
      </div>

      {/* Quick Stats Cards with home screen colors */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-soft-gold/10 to-coral-orange/10 border-soft-gold/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Coins className="h-5 w-5 text-soft-gold mr-2" />
              <div className="text-2xl font-bold text-soft-gold">
                {coinsLoading ? "..." : coins}
              </div>
            </div>
            <div className="text-xs text-gunmetal-gray font-medium">Coins</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-coral-orange/10 to-flamingo-pink/10 border-coral-orange/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-coral-orange mr-2" />
              <div className="text-2xl font-bold text-coral-orange">
                {userStats.friendsMade}
              </div>
            </div>
            <div className="text-xs text-gunmetal-gray font-medium">
              Friends Made
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-gradient-to-br from-flamingo-pink/10 to-blush-peach/10 border-flamingo-pink/30 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-flamingo-pink">
              {userStats.totalChats}
            </div>
            <div className="text-xs text-gunmetal-gray font-medium">Chats</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-royal-violet/10 to-flamingo-pink/10 border-royal-violet/30 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-royal-violet">
              {userStats.hoursSpent}h
            </div>
            <div className="text-xs text-gunmetal-gray font-medium">Hours</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blush-peach/10 to-coral-orange/10 border-blush-peach/30 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blush-peach">
              {userStats.streak}
            </div>
            <div className="text-xs text-gunmetal-gray font-medium">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Section with home screen colors */}
      <Card className="bg-gradient-to-r from-soft-gold/10 to-coral-orange/10 border-2 border-soft-gold/30 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-gunmetal-gray">
            <div className="bg-soft-gold/20 p-2 rounded-full">
              <Gift className="h-6 w-6 text-soft-gold" />
            </div>
            {t("profile.referral.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-soft-gold/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-soft-gold font-bold">
                  {t("profile.referral.id")}
                </span>
                <div className="font-mono text-gunmetal-gray text-lg font-extrabold tracking-wider">
                  {referralId}
                </div>
              </div>
              <Button
                onClick={handleCopyReferral}
                className="bg-gradient-to-r from-soft-gold to-coral-orange text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("profile.referral.copy")}
              </Button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gunmetal-gray font-bold mb-2">
              {t("profile.referral.reward")}
            </p>
            <p className="text-xs text-gunmetal-gray/70 font-medium">
              {t("profile.referral.share")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={`${
            achievement.unlocked 
              ? "bg-gradient-to-r from-soft-gold/10 to-coral-orange/10 border-soft-gold/30 shadow-md" 
              : "bg-gray-50 border-gray-200"
          } transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={`text-3xl ${achievement.unlocked ? "grayscale-0" : "grayscale"}`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-bold ${
                    achievement.unlocked ? "text-gunmetal-gray" : "text-gray-600"
                  }`}
                >
                  {achievement.title}
                </h3>
                <p
                  className={`text-sm ${
                    achievement.unlocked ? "text-gunmetal-gray/70" : "text-gray-500"
                  }`}
                >
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className="bg-gradient-to-r from-soft-gold to-coral-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  Unlocked
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {t("app.name")} - {t("profile.title")}
        </title>
      </Helmet>
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto bg-gradient-to-br from-flamingo-pink/5 via-blush-peach/5 to-coral-orange/5 px-2 py-4 relative pb-20 overflow-hidden">
        {/* Enhanced Animated Background Elements matching home screen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-flamingo-pink/20 to-coral-orange/20 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-4 w-10 h-10 bg-gradient-to-br from-royal-violet/20 to-blush-peach/20 rounded-full opacity-30 animate-bounce"></div>
          <div
            className="absolute bottom-32 left-4 w-8 h-8 bg-gradient-to-br from-soft-gold/20 to-flamingo-pink/20 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-48 right-8 w-6 h-6 bg-gradient-to-br from-flamingo-pink/20 to-royal-violet/20 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
          {/* Add romantic symbols matching home */}
          <div
            className="absolute top-16 right-16 text-flamingo-pink/40 text-lg animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            💕
          </div>
          <div
            className="absolute bottom-64 left-12 text-coral-orange/35 text-base animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            🌸
          </div>
          <div
            className="absolute top-48 left-6 text-soft-gold/30 text-sm animate-pulse"
            style={{ animationDelay: "2.5s" }}
          >
            ✨
          </div>
        </div>

        {/* Enhanced Header matching home screen */}
        <header className="w-full bg-gradient-to-r from-flamingo-pink via-blush-peach to-coral-orange shadow-lg px-4 py-4 relative overflow-hidden">
          {/* Header Background Pattern matching home */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/25 to-white/15 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="text-white font-bold text-xl hover:scale-110 transition-all duration-200 p-2 rounded-full hover:bg-white/15"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {t("profile.title")}
              </h1>
              {isPremium && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-soft-gold/80 to-royal-violet/80 px-2 py-0.5 rounded-full shadow-md">
                  <Crown className="h-3 w-3 text-white" />
                  <span className="text-white text-xs font-bold">PREMIUM</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePremiumClick}
              className="hover:scale-110 transition-all duration-200 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
            >
              <Crown className="h-6 w-6 text-soft-gold" />
            </button>
          </div>
        </header>

        <div className="w-full flex flex-col bg-white/90 backdrop-blur-sm rounded-b-2xl border border-flamingo-pink/20 shadow-2xl mb-6 overflow-hidden relative z-10">
          {/* Premium Status Banner with home colors */}
          {isPremium ? (
            <div className="bg-gradient-to-r from-soft-gold via-coral-orange to-flamingo-pink p-4 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/10 to-white/15 animate-pulse"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Crown className="h-6 w-6 text-white animate-pulse" />
                  <h2 className="text-base font-bold">
                    {t("profile.premium.active")}
                  </h2>
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <p className="text-white/90 text-sm font-medium">
                  Expires: {formatPremiumExpiry()}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="bg-gradient-to-r from-royal-violet via-flamingo-pink to-coral-orange p-4 text-white text-center cursor-pointer relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              onClick={handlePremiumClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/20 to-white/15 animate-pulse"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Crown className="h-6 w-6 text-soft-gold animate-bounce" />
                  <h2 className="text-base font-bold">
                    {t("profile.premium.upgrade")}
                  </h2>
                  <Sparkles className="h-5 w-5 text-soft-gold animate-pulse" />
                </div>
                <div className="flex justify-center gap-3 text-white/90 text-xs font-medium mb-2">
                  <span>{t("profile.premium.features.gender")}</span>
                  <span>{t("profile.premium.features.voice")}</span>
                  <span>{t("profile.premium.features.unlimited")}</span>
                </div>
                <div className="text-soft-gold text-sm font-bold animate-pulse">
                  ✨ Tap to upgrade! ✨
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation with home colors */}
          <div className="flex bg-gradient-to-r from-flamingo-pink/5 to-coral-orange/5 border-b border-flamingo-pink/20">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "achievements", label: "Awards", icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-flamingo-pink border-b-4 border-flamingo-pink shadow-sm"
                    : "text-gunmetal-gray hover:text-flamingo-pink hover:bg-flamingo-pink/5"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "achievements" && renderAchievementsTab()}
          </div>

          {/* Settings Section with home colors */}
          <div className="p-4 bg-gradient-to-r from-flamingo-pink/5 to-coral-orange/5 border-t border-flamingo-pink/20">
            <h3 className="font-bold text-gunmetal-gray text-base flex items-center gap-2 mb-3">
              <div className="bg-flamingo-pink/20 p-1.5 rounded-full">
                <Settings className="h-4 w-4 text-flamingo-pink" />
              </div>
              {t("profile.settings")}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {/* Storage Debug Button */}
              <button
                onClick={() => navigate("/storage-debug")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-all duration-300 border border-blue-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Database className="h-5 w-5 text-blue-600 mb-1" />
                <span className="text-blue-700 font-semibold text-xs">
                  Storage Debug
                </span>
              </button>
              <button
                onClick={() => handleSettingsClick("privacy")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-flamingo-pink/10 transition-all duration-300 border border-flamingo-pink/30 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Shield className="h-5 w-5 text-flamingo-pink mb-1" />
                <span className="text-flamingo-pink font-semibold text-xs">
                  Privacy
                </span>
              </button>

              <button
                onClick={() => handleSettingsClick("notifications")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-flamingo-pink/10 transition-all duration-300 border border-flamingo-pink/30 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Bell className="h-5 w-5 text-flamingo-pink mb-1" />
                <span className="text-flamingo-pink font-semibold text-xs">
                  Notifications
                </span>
              </button>

              <button
                onClick={() => handleSettingsClick("account")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-flamingo-pink/10 transition-all duration-300 border border-flamingo-pink/30 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <User className="h-5 w-5 text-flamingo-pink mb-1" />
                <span className="text-flamingo-pink font-semibold text-xs">
                  Account
                </span>
              </button>

              <button
                onClick={() => setShowLanguageSelector(true)}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-flamingo-pink/10 transition-all duration-300 border border-flamingo-pink/30 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Globe className="h-5 w-5 text-flamingo-pink mb-1" />
                <span className="text-flamingo-pink font-semibold text-xs">
                  Language
                </span>
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-flamingo-pink/10 transition-all duration-300 border border-flamingo-pink/30 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <HelpCircle className="h-5 w-5 text-flamingo-pink mb-1" />
                <span className="text-flamingo-pink font-semibold text-xs">
                  Help
                </span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to logout?")) {
                    localStorage.clear();
                    navigate("/onboarding");
                  }
                }}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-red-50 transition-all duration-300 border border-red-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <LogOut className="h-5 w-5 text-red-600 mb-1" />
                <span className="text-red-700 font-semibold text-xs">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        <BottomNavBar />
      </main>

      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchase={handlePremiumPurchase}
      />

      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          setSettingsType(null);
        }}
        settingType={settingsType}
      />

      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
};

export default ProfilePage;