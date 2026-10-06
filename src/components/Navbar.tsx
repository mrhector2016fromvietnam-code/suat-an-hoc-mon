import React from 'react';
import { Utensils, Phone, Building2, ChefHat, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  portalMode: 'client' | 'kitchen';
  setPortalMode: (mode: 'client' | 'kitchen') => void;
  onOpenAiAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  portalMode,
  setPortalMode,
  onOpenAiAdvisor
}) => {
  const navItems = [
    { id: 'overview', label: 'Tổng Quan' },
    { id: 'menu', label: 'Thực Đơn Tuần' },
    { id: 'packages', label: 'Gói Suất Ăn' },
    { id: 'daily-orders', label: 'Báo Suất Ăn' },
    { id: 'food-safety', label: 'Kiểm Thực ATTP' },
    { id: 'fleet', label: 'Đội Xe & Lộ Trình' },
    { id: 'quote', label: 'Tạo Báo Giá' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-300">HACCP & ISO 22000:2018</span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span className="hidden sm:inline">Trung tâm chế biến 1 chiều: Nguyễn Văn Bứa, Xuân Thới Sơn, Hóc Môn, TP.HCM</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Phone className="w-3.5 h-3.5" /> Hotline 24/7: 1900 6828 - 0908 123 456
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 block leading-tight">
                HÓC MÔN <span className="text-emerald-600">CATERING</span>
              </span>
              <span className="text-[11px] text-neutral-500 block font-medium">
                Suất Ăn Công Nghiệp & Bán Trú
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line links) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-xs xl:text-sm ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors shadow-xs"
            title="Trợ lý Dinh Dưỡng Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Dinh Dưỡng AI</span>
          </button>

          {/* Mode Switcher Segmented Control */}
          <div className="bg-neutral-100 p-1 rounded-lg flex items-center text-xs font-medium border border-neutral-200">
            <button
              onClick={() => setPortalMode('client')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                portalMode === 'client'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Chế độ Cổng Doanh Nghiệp"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Doanh Nghiệp</span>
            </button>
            <button
              onClick={() => setPortalMode('kitchen')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                portalMode === 'kitchen'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Chế độ Điều Hành Bếp"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Điều Hành Bếp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Scrollable Navigation */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-neutral-200 bg-neutral-50/70 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-neutral-600 bg-white border border-neutral-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
