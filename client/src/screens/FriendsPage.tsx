import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BottomNavBar from '../components/BottomNavBar';
import PremiumPaywall from '../components/PremiumPaywall';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Video, Crown, Users, Trash2, UserPlus } from 'lucide-react';
import { useFriends } from '../context/FriendsProvider';
import { usePremium } from '../context/PremiumProvider';

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { friends, removeFriend, canAddMoreFriends, maxFreeLimit } = useFriends();
  const { isPremium, setPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleVideoCall = (friendId: string, friendName: string) => {
    // Show rewarded ad before call
    alert("🎬 Watch this ad to start your call with " + friendName);
    
    // Navigate to video chat with friend
    navigate('/video-chat', { 
      state: { 
        friendCall: true, 
        friendId, 
        friendName 
      } 
    });
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    if (confirm(`Remove ${friendName} from your friends list?`)) {
      removeFriend(friendId);
    }
  };

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
    alert(`🎉 Welcome to Premium! You can now add unlimited friends!`);
  };

  const formatLastSeen = (lastSeen?: Date) => {
    if (!lastSeen) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <Helmet>
        <title>AjnabiCam - Friends</title>
      </Helmet>
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto bg-gradient-to-br from-white via-pink-50 to-orange-50 px-2 py-4 relative pb-20">
        {/* Header */}
        <div className="w-full flex items-center p-4 text-white font-bold text-xl rounded-t-2xl shadow-xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #F44B7F 0%, #FFB6B9 50%, #FF6661 100%)'}}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          
          <button 
            onClick={handleBackClick} 
            className="relative z-10 mr-3 text-white font-bold text-xl hover:scale-110 transition-all duration-200 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="relative z-10 flex items-center flex-grow justify-center gap-3">
            <Users className="h-7 w-7 text-white/90" />
            <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
          </div>
        </div>

        <div className="w-full flex flex-col bg-white/95 backdrop-blur-sm rounded-b-2xl border shadow-2xl mb-6 overflow-hidden" style={{borderColor: 'rgba(244, 75, 127, 0.2)'}}>
          {/* Friends Limit Info */}
          <div className="p-4 border-b relative overflow-hidden" style={{background: 'linear-gradient(90deg, rgba(255, 182, 185, 0.3), rgba(255, 102, 97, 0.2))', borderBottomColor: 'rgba(244, 75, 127, 0.2)'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
            <div className="flex items-center justify-between">
              <div className="relative z-10">
                <h3 className="font-bold text-lg" style={{color: '#F44B7F'}}>Your Friends</h3>
                <p className="text-sm font-medium" style={{color: '#8E44AD'}}>
                  {isPremium 
                    ? `${friends.length} friends (Unlimited)` 
                    : `${friends.length}/${maxFreeLimit} friends (Free)`
                  }
                </p>
              </div>
              
              {!isPremium && (
                <Button
                  onClick={handleUpgrade}
                  size="sm"
                  className="relative z-10 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style={{background: 'linear-gradient(90deg, #8E44AD, #F44B7F)'}}
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Upgrade
                </Button>
              )}
            </div>
            
            {!canAddMoreFriends && (
              <div className="relative z-10 mt-3 p-3 rounded-xl border backdrop-blur-sm" style={{background: 'linear-gradient(90deg, rgba(255, 102, 97, 0.1), rgba(255, 182, 185, 0.1))', borderColor: 'rgba(255, 102, 97, 0.3)'}}>
                <p className="text-sm font-bold" style={{color: '#FF6661'}}>
                  🚫 You've reached the free limit of {maxFreeLimit} friends. Upgrade to Premium for unlimited friends!
                </p>
              </div>
            )}
          </div>

          {/* Friends List */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center p-4 border-b transition-all duration-300 hover:shadow-md transform hover:scale-[1.01]"
                  style={{
                    borderBottomColor: 'rgba(244, 75, 127, 0.1)',
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 182, 185, 0.05))'
                  }}
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={`${friend.name} avatar`}
                      className="w-14 h-14 rounded-full object-cover border-3 shadow-lg transition-all duration-300"
                      style={{borderColor: 'rgba(244, 75, 127, 0.3)'}}
                    />
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-md animate-pulse" style={{backgroundColor: '#22c55e'}}></div>
                    )}
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg" style={{color: '#2F2F2F'}}>{friend.name}</h3>
                      {friend.isOnline && (
                        <span className="text-xs px-2 py-1 rounded-full font-bold border backdrop-blur-sm" style={{
                          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.15))',
                          color: '#22c55e',
                          borderColor: 'rgba(34, 197, 94, 0.3)'
                        }}>
                          Online
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium" style={{color: '#8E44AD'}}>
                      {friend.isOnline ? 'Active now' : `Last seen ${formatLastSeen(friend.lastSeen)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleVideoCall(friend.id, friend.name)}
                      size="sm"
                      className="text-white p-2 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      style={{background: 'linear-gradient(90deg, #22c55e, #16a34a)'}}
                      disabled={!friend.isOnline}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleRemoveFriend(friend.id, friend.name)}
                      size="sm"
                      variant="outline"
                      className="p-2 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      style={{
                        color: '#FF6661',
                        borderColor: 'rgba(255, 102, 97, 0.3)',
                        background: 'rgba(255, 102, 97, 0.05)'
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="relative mb-8">
                  <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">👥</div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-ping opacity-75" style={{background: 'linear-gradient(90deg, #F44B7F, #FF6661)'}}></div>
                </div>
                <div className="bg-gradient-to-br from-white/90 to-pink-50/90 backdrop-blur-sm rounded-3xl p-8 border shadow-xl max-w-sm" style={{borderColor: 'rgba(244, 75, 127, 0.2)'}}>
                  <h3 className="text-2xl font-bold mb-4" style={{color: '#F44B7F'}}>No Friends Yet</h3>
                  <p className="mb-6 leading-relaxed font-medium" style={{color: '#8E44AD'}}>
                  Make friends by staying connected after video calls!
                </p>
                  <Button
                    onClick={() => navigate('/video-chat')}
                    className="text-white font-bold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                    style={{background: 'linear-gradient(90deg, #F44B7F, #FF6661)'}}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Start Meeting People
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Add Friends Tip */}
          {friends.length > 0 && canAddMoreFriends && (
            <div className="p-4 border-t relative overflow-hidden" style={{background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))', borderTopColor: 'rgba(34, 197, 94, 0.2)'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
              <p className="relative z-10 text-sm font-bold text-center" style={{color: '#22c55e'}}>
                💡 <strong>Tip:</strong> After video calls, choose "Stay Connected" to add them as friends!
              </p>
            </div>
          )}
        </div>
        
        <BottomNavBar />
      </main>

      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchase={handlePremiumPurchase}
      />
    </>
  );
};

export default FriendsPage;