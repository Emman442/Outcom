import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { OutcomLogo, SolanaIcon } from '../common/NetworkIcons';
import { Button } from '../common/Button';
import { UserWallet, NotificationItem, NavigationTab } from '../../types';
import { Search, Bell, CheckCircle, ArrowUpRight, DollarSign, X } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export type ActiveTab = 'discover' | 'workspace' | 'employer' | 'leaderboard' | 'reputation';

interface NavbarProps {
  currentTab?: NavigationTab;
  onNavigate?: (tab: NavigationTab) => void;
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onOpenWalletModal: () => void;
  onOpenSearch?: () => void;
  notifications?: NotificationItem[];
  onOpenCreateTrial?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  activeTab,
  setActiveTab,
  onOpenWalletModal,
  onOpenSearch,
  notifications = [],
  onOpenCreateTrial,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { connected, wallet, publicKey, disconnect } = useWallet()
  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  // Determine current active section from URL or props
  const getActiveTab = (): string => {
    const p = location.pathname;
    if (p === '/discover') return 'discover';
    if (p === '/work-trials' || p === '/workspace') return 'workspace';
    if (p === '/employer' || p === '/employer-hub') return 'employer';
    if (p === '/leaderboard') return 'leaderboard';
    if (p === '/reputation') return 'reputation';
    if (p.startsWith('/trials')) return 'trials';
    if (p === '/') return 'landing';
    return currentTab || activeTab || 'discover';
  };

  const current = getActiveTab();

  const handleTabClick = (tab: NavigationTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (setActiveTab) {
      setActiveTab(tab as ActiveTab);
    }
  };

  const shortAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090A0C]/95 backdrop-blur-md border-b border-[#24282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            onClick={() => handleTabClick('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer select-none"
          >
            <OutcomLogo className="w-8 h-8 group-hover:border-[#0052FF] transition-colors" />
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight font-sans flex items-center gap-1.5">
                Outcom.
              </span>
              <span className="text-[10px] text-[#9CA3AF] tracking-wide font-mono -mt-1 hidden sm:inline">
                Outcome Protocol
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/discover"
              onClick={() => handleTabClick('discover')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${current === 'discover'
                  ? 'text-white bg-[#181B20] border border-[#24282D]'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#121417]'
                }`}
            >
              Discover
            </Link>
            <Link
              to="/work-trials"
              onClick={() => handleTabClick('workspace')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer relative ${current === 'workspace'
                  ? 'text-white bg-[#181B20] border border-[#24282D]'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#121417]'
                }`}
            >
              Work Trials
            </Link>
            <Link
              to="/employer"
              onClick={() => handleTabClick('employer')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${current === 'employer'
                  ? 'text-white bg-[#181B20] border border-[#24282D]'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#121417]'
                }`}
            >
              Employer Hub
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => handleTabClick('leaderboard')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${current === 'leaderboard'
                  ? 'text-white bg-[#181B20] border border-[#24282D]'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#121417]'
                }`}
            >
              Leaderboard
            </Link>
            <Link
              to="/reputation"
              onClick={() => handleTabClick('reputation')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${current === 'reputation'
                  ? 'text-white bg-[#181B20] border border-[#24282D]'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#121417]'
                }`}
            >
              Reputation
            </Link>
          </nav>
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={() => {
              if (onOpenSearch) {
                onOpenSearch();
              } else {
                navigate('/discover');
                handleTabClick('discover');
              }
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#121417] hover:bg-[#181B20] border border-[#24282D] text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            title="Search trials (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search trials...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181B20] border border-[#2D333B] text-[#6B7280]">
              /
            </kbd>
          </button>

          {/* Create Trial Action for Employers */}
          {onOpenCreateTrial && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCreateTrial}
              className="hidden sm:inline-flex text-xs"
            >
              + Create Trial
            </Button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-[#121417] hover:bg-[#181B20] border border-[#24282D] text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0052FF]" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0D0F12] border border-[#24282D] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#24282D]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Protocol Activity
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181B20] text-[#0052FF] border border-[#24282D]">
                      Live
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 mt-3 max-h-72 overflow-y-auto">
                  {safeNotifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#6B7280]">
                      No new notifications
                    </div>
                  ) : (
                    safeNotifications.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-[#121417] border border-[#24282D] hover:border-[#323842] transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-medium text-white flex items-center gap-1.5">
                            {item.type === 'payout' && <DollarSign className="w-3 h-3 text-[#10B981]" />}
                            {item.type === 'verification' && <CheckCircle className="w-3 h-3 text-[#0052FF]" />}
                            {item.type === 'referral' && <ArrowUpRight className="w-3 h-3 text-[#F59E0B]" />}
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#6B7280] font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-1">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Solana Wallet Button */}
          {connected && publicKey ? (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121417] hover:bg-[#181B20] border border-[#24282D] hover:border-[#3A414A] transition-colors cursor-pointer group"
            >
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              <SolanaIcon className="w-3.5 h-3.5 text-[#14F195] opacity-90 group-hover:opacity-100" />
              <span className="text-xs font-mono text-white tracking-tight font-medium">
                {shortAddress}
              </span>
            </button>
          ) : (

            <WalletMultiButton className="h-9 px-4 bg-[#121417] hover:bg-[#181B20] border border-[#24282D] hover:border-[#31373E] text-xs font-medium text-[#9CA3AF] hover:text-white rounded-lg transition-colors font-sans shadow-none" />
          )}
        </div>
      </div>

      {/* Mobile Navigation sub-bar */}
      <div className="md:hidden border-t border-[#24282D] px-4 py-2 flex items-center justify-around text-xs bg-[#090A0C]">
        <Link
          to="/discover"
          onClick={() => handleTabClick('discover')}
          className={`py-1 px-2.5 rounded ${current === 'discover' ? 'text-[#3B82F6] font-semibold bg-[#121417]' : 'text-[#9CA3AF]'
            }`}
        >
          Discover
        </Link>
        <Link
          to="/work-trials"
          onClick={() => handleTabClick('workspace')}
          className={`py-1 px-2.5 rounded ${current === 'workspace' ? 'text-[#3B82F6] font-semibold bg-[#121417]' : 'text-[#9CA3AF]'
            }`}
        >
          Work Trials
        </Link>
        <Link
          to="/employer"
          onClick={() => handleTabClick('employer')}
          className={`py-1 px-2.5 rounded ${current === 'employer' ? 'text-[#3B82F6] font-semibold bg-[#121417]' : 'text-[#9CA3AF]'
            }`}
        >
          Employer Hub
        </Link>
        <Link
          to="/leaderboard"
          onClick={() => handleTabClick('leaderboard')}
          className={`py-1 px-2.5 rounded ${current === 'leaderboard' ? 'text-[#3B82F6] font-semibold bg-[#121417]' : 'text-[#9CA3AF]'
            }`}
        >
          Leaderboard
        </Link>
        <Link
          to="/reputation"
          onClick={() => handleTabClick('reputation')}
          className={`py-1 px-2.5 rounded ${current === 'reputation' ? 'text-[#3B82F6] font-semibold bg-[#121417]' : 'text-[#9CA3AF]'
            }`}
        >
          Reputation
        </Link>
      </div>
    </header>
  );
};
