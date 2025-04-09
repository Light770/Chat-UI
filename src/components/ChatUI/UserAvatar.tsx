// components/ChatUI/UserAvatar.tsx
import React from 'react';

interface User {
  name: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

interface UserAvatarProps {
  user: User;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showStatus = false,
  className = '',
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarSize = () => {
    switch (size) {
      case 'xs': return 'h-6 w-6 text-xs';
      case 'sm': return 'h-8 w-8 text-sm';
      case 'md': return 'h-10 w-10 text-base';
      case 'lg': return 'h-12 w-12 text-lg';
      case 'xl': return 'h-16 w-16 text-xl';
      default: return 'h-10 w-10 text-base';
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case 'xs': return 'h-1.5 w-1.5';
      case 'sm': return 'h-2 w-2';
      case 'md': return 'h-2.5 w-2.5';
      case 'lg': return 'h-3 w-3';
      case 'xl': return 'h-4 w-4';
      default: return 'h-2.5 w-2.5';
    }
  };

  const getStatusPosition = () => {
    switch (size) {
      case 'xs': return '-right-0.5 -bottom-0.5';
      case 'sm': return '-right-0.5 -bottom-0.5';
      case 'md': return '-right-1 -bottom-1';
      case 'lg': return '-right-1 -bottom-1';
      case 'xl': return '-right-1.5 -bottom-1.5';
      default: return '-right-1 -bottom-1';
    }
  };

  const getStatusColor = () => {
    switch (user.status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Random background color based on user name - now using gradients
  const getBackgroundColor = () => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-yellow-500 to-orange-600',
      'bg-gradient-to-br from-red-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-blue-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
    ];
    
    // Simple hash function to consistently assign colors based on name
    const hash = user.name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={`${user.name}'s avatar`}
          className={`${getAvatarSize()} rounded-full object-cover shadow-md border border-white/30 dark:border-gray-700/30`}
        />
      ) : (
        <div className={`${getAvatarSize()} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white font-medium shadow-md`}>
          {getInitials(user.name)}
        </div>
      )}
      
      {showStatus && user.status && (
        <span className={`absolute ${getStatusPosition()} ${getStatusSize()} ${getStatusColor()} rounded-full ring-2 ring-white dark:ring-gray-800`} />
      )}
    </div>
  );
};

export default UserAvatar;