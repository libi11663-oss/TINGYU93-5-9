import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { saveSubmission } from './firebase';
import { 
  Bike, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Send, 
  Megaphone, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Menu, 
  Phone, 
  Mail, 
  User, 
  Briefcase, 
  HelpCircle,
  Clock,
  Calendar,
  AlertTriangle,
  Users
} from 'lucide-react';

// Types
type AdType = 'box' | 'mudguard' | 'bundle';
type RegionType = 'north' | 'mid-south' | 'others';

const CITY_DISTRICTS: Record<string, string[]> = {
  '台北市': ['大安區', '信義區', '中山區', '內湖區', '士林區', '中正區', '萬華區', '松山區', '大同區', '文山區', '南港區', '北投區'],
  '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '汐止區', '樹林區', '三峽區', '淡水區'],
  '桃園市': ['桃園區', '中壢區', '八德區', '平鎮區', '蘆竹區', '龜山區', '龍潭區', '楊梅區'],
  '台中市': ['西屯區', '北屯區', '南屯區', '西區', '北區', '中區', '東區', '南區', '豐原區', '大里區', '太平區', '沙鹿區'],
  '台南市': ['東區', '永康區', '安平區', '中西區', '北區', '安南區', '南區', '歸仁區', '新營區'],
  '高雄市': ['三民區', '鼓山區', '左營區', '前鎮區', '苓雅區', '鳳山區', '新興區', '小港區', '楠梓區', '大寮區'],
  '其他縣市': ['基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣']
};

export default function App() {
  // Navigation & Scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Advertiser Simulator States
  const [boxColor, setBoxColor] = useState<string>('#FF5A00');
  const [boxSlogan, setBoxSlogan] = useState<string>('下載APP享新客優惠');
  const [mudguardText, setMudguardText] = useState<string>('穿巷廣告・安全第一');
  const [scooterColor, setScooterColor] = useState<string>('#1E293B');
  const [activePresetSlogan, setActivePresetSlogan] = useState<number>(0);

  // Form states
  const [userRole, setUserRole] = useState<'rider' | 'advertiser'>('rider');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    scooterModel: '',
    deliveryPlatform: 'both',
    companyName: '',
    budget: 'under-5w',
    message: '',
    dailyHours: '6',
    weeklyDays: '5',
    primaryRegion: '',
    address: '',
    bankAccount: '',
    selectedDistricts: [] as string[]
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState<number>(8);
  const [isCountdownPaused, setIsCountdownPaused] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Preset slogans for advertisers to preview (Mudguard focused)
  const presetSlogans = [
    { text: '安全第一 保持距離', description: '經典警語' },
    { text: '今日不踩雷 萬人好評', description: '美食餐飲' },
    { text: '穿巷車隊 全城高曝光', description: '品牌招商' },
    { text: '投放廣告 專線預約中', description: '客服熱線' }
  ];

  // Box color presets
  const colorPresets = [
    { name: '活力橘', hex: '#FF5A00' },
    { name: '極致黑', hex: '#111827' },
    { name: '優雅綠', hex: '#10B981' },
    { name: '熱情紅', hex: '#EF4444' },
    { name: '星空藍', hex: '#3B82F6' },
    { name: '蜜桃粉', hex: '#EC4899' }
  ];

  // Track window scroll to make navbar sticky and glassmorphic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await saveSubmission({
        role: userRole,
        ...formData
      });
      setFormSubmitted(true);
      setCountdown(8);
      setIsCountdownPaused(false);
    } catch (err: any) {
      console.error("Failed to save submission:", err);
      setSubmitError(err?.message || "資料儲存失敗，請確認網路連線或重試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Automatic form submission countdown and auto-reset/auto-close
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (formSubmitted && !isCountdownPaused) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Done!
            if (isModalOpen) {
              setIsModalOpen(false);
            }
            // Clear form fields
            setFormData({
              name: '',
              phone: '',
              email: '',
              city: '',
              scooterModel: '',
              deliveryPlatform: 'both',
              companyName: '',
              budget: 'under-5w',
              message: '',
              dailyHours: '6',
              weeklyDays: '5',
              primaryRegion: '',
              address: '',
              bankAccount: '',
              selectedDistricts: []
            });
            setFormSubmitted(false);
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [formSubmitted, isCountdownPaused, isModalOpen]);

  const openFormWithRole = (role: 'rider' | 'advertiser') => {
    setUserRole(role);
    setIsModalOpen(true);
  };

  const handleReserveDistrict = (districtName: string) => {
    setUserRole('advertiser');
    setFormData(prev => ({
      ...prev,
      message: `我對【${districtName}】的穿巷車隊廣告與曝光熱點感興趣，希望能索取本區的廣告流量預算規劃與詳細報價。`
    }));
    setIsModalOpen(true);
  };

  const faqs = [
    {
      q: '機車擋泥板和外送箱貼紙安裝會傷到我的車子嗎？',
      a: '完全不會！我們採用專利高質感不留膠車貼與免鑽孔擋泥板支架。由穿巷專業技師團隊為您安裝與拆除，保證不傷烤漆、不留殘膠、不破壞車身結構。'
    },
    {
      q: '廣告費是每個月固定發放嗎？要如何結算？',
      a: '是的！只要您每月達到最低上線要求，我們將透過專屬平台進行結算。每月 10 號將上月被動收入匯入您的指定帳戶。'
    },
    {
      q: '我不是專職外送員，只是偶爾跑外送也可以加入嗎？',
      a: '非常歡迎！不論是兼職、專職、甚至是平常有長途通勤習慣的機車族，只要符合基礎里程與車輛清潔外觀標準，都歡迎申請加入穿巷騎士！'
    },
    {
      q: '廣告主可以如何追蹤廣告曝光效果？',
      a: '穿巷提供完整的「實時里程數據追蹤」與「地區熱點地圖分析」！每位簽約騎士均有 GPS 定位系統，並於每月結算時提供完整的曝光時數、跑跑區域分析與多角度車體照片驗收，讓您每一分預算都清晰可見。'
    },
    {
      q: '如果遇到下雨或車子維修，收益會受影響嗎？',
      a: '只要每個月累積的配送里程與上線天數達標，就不會受到單日氣候或短期維修影響。我們設計了極具彈性的分級收益機制，即使跑得少也有對應的基礎被動獎金。'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-[#FFD600]">
      {/* Decorative stripes/lines from the design */}
      <div className="absolute top-0 right-[25%] w-[1px] h-full bg-[#111111] opacity-5 pointer-events-none z-0" />
      <div className="absolute top-0 left-[60%] w-[1px] h-full bg-[#111111] opacity-5 pointer-events-none z-0" />
      
      {/* Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[#FFD600] border-b-4 border-[#111111] py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="bg-[#111111] text-[#FFD600] font-black text-2xl px-3 py-1 tracking-tighter transition-transform group-hover:scale-105 duration-200">
              穿巷
            </div>
            <div className="text-[10px] uppercase font-black tracking-widest leading-none text-[#111111]">
              Alley Shuttler<br/>Delivery Ads
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#rider-section" className="text-sm font-bold uppercase tracking-widest text-[#111111] hover:underline decoration-2 underline-offset-4 transition-all">騎士月收益</a>
            <a href="#benefits-section" className="text-sm font-bold uppercase tracking-widest text-[#111111] hover:underline decoration-2 underline-offset-4 transition-all">合作優勢</a>
            <a href="#faq-section" className="text-sm font-bold uppercase tracking-widest text-[#111111] hover:underline decoration-2 underline-offset-4 transition-all">常見問題</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => openFormWithRole('advertiser')}
              className="px-4 py-2 text-sm font-black uppercase tracking-wider text-[#111111] border-2 border-transparent hover:border-[#111111] transition-all"
            >
              廣告主洽詢
            </button>
            <button 
              onClick={() => openFormWithRole('rider')}
              className="px-6 py-2.5 text-sm font-black uppercase tracking-wider text-[#FFD600] bg-[#111111] border-2 border-[#111111] hover:bg-transparent hover:text-[#111111] brutalist-shadow-sm transition-all duration-200"
            >
              加入跑單賺外快
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-[#111111] bg-[#FFD600] text-[#111111] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FFD600] border-b-4 border-[#111111] overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-3">
                <a 
                  href="#rider-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-bold uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
                >
                  騎士月收益
                </a>
                <a 
                  href="#benefits-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-bold uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
                >
                  合作優勢
                </a>
                <a 
                  href="#faq-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-bold uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-[#FFD600] transition-colors"
                >
                  常見問題
                </a>
                
                <div className="pt-4 border-t-2 border-[#111111] flex flex-col gap-2">
                  <button 
                    onClick={() => { setMobileMenuOpen(false); openFormWithRole('advertiser'); }}
                    className="w-full py-2.5 text-center text-sm font-bold uppercase tracking-wider text-[#111111] border-2 border-[#111111] bg-white transition-all"
                  >
                    廣告主洽詢
                  </button>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); openFormWithRole('rider'); }}
                    className="w-full py-2.5 text-center text-sm font-bold uppercase tracking-wider text-[#FFD600] bg-[#111111] border-2 border-[#111111] transition-all"
                  >
                    加入跑單賺外快
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#FFD600] border-b-4 border-[#111111]">
        {/* Decorative Grid and Stripe Patterns from design HTML */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] border-[60px] border-[#111111] opacity-5 rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-full h-[2px] bg-[#111111] opacity-15 rotate-[-3deg] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-full h-[2px] bg-[#111111] opacity-15 rotate-[-3deg] pointer-events-none" />
        <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 -rotate-90 text-[10px] uppercase tracking-[0.5em] font-black opacity-30 whitespace-nowrap hidden xl:block">
          Urban Mobility Marketing System — 2026
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            
            {/* Centered Info Column */}
            <div className="w-full max-w-4xl space-y-8 text-center flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-[#111111] bg-white text-[#111111] text-xs font-black uppercase tracking-widest brutalist-shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>機車移動廣告新創領航者</span>
              </div>

              {/* Title Block */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl leading-[0.9] font-black tracking-tighter text-[#111111] uppercase">
                  穿巷外送廣告
                </h1>
                
                {/* Subtitle 1 */}
                <p className="text-xl sm:text-2xl font-black leading-tight text-[#111111] tracking-normal">
                  讓品牌穿梭在城市的大街小巷中。
                </p>

                {/* Subtitle 2 */}
                <p className="text-lg sm:text-xl font-bold text-[#111111] opacity-90 leading-relaxed">
                  把機車擋泥板與外送箱 變成您的每月<span className="bg-[#111111] text-[#FFD600] px-2 py-0.5 ml-1">被動收入</span>。
                </p>
              </div>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
                <div className="flex items-center gap-3 bg-white p-3 border-4 border-[#111111] rounded-none brutalist-shadow">
                  <div className="w-8 h-8 rounded-none bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center text-[#111111] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider">高曝光時數</span>
                    <span className="text-sm font-black text-[#111111] leading-tight block">外送員長期送單穿梭</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-3 border-4 border-[#111111] rounded-none brutalist-shadow">
                  <div className="w-8 h-8 rounded-none bg-[#111111] border-2 border-[#111111] flex items-center justify-center text-[#FFD600] shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider">廣告高曝光率</span>
                    <span className="text-sm font-black text-[#111111] leading-tight block">100% 深入巷弄</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 border-4 border-[#111111] rounded-none brutalist-shadow">
                  <div className="w-8 h-8 rounded-none bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center text-[#111111] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider">吸睛視野</span>
                    <span className="text-sm font-black text-[#111111] leading-tight block">等紅燈曝光時機不放過</span>
                  </div>
                </div>
              </div>

              {/* CTA Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <button 
                  onClick={() => openFormWithRole('rider')}
                  className="w-full sm:w-auto px-8 py-4 font-black text-lg uppercase tracking-tighter text-[#FFD600] bg-[#111111] border-4 border-[#111111] hover:bg-[#FFD600] hover:text-[#111111] transition-all duration-200 rounded-none brutalist-shadow flex items-center justify-center gap-2"
                >
                  <Bike className="w-5 h-5" />
                  <span>立即加入騎士行列</span>
                </button>
                
                <button 
                  onClick={() => openFormWithRole('advertiser')}
                  className="w-full sm:w-auto px-8 py-4 font-black text-lg uppercase tracking-tighter text-[#111111] bg-white border-4 border-[#111111] hover:bg-[#111111] hover:text-[#FFD600] transition-all duration-200 rounded-none brutalist-shadow flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-5 h-5" />
                  <span>投放品牌廣告</span>
                </button>
              </div>

              {/* Short Social Proof */}
              <p className="text-xs text-[#111111]/80 font-bold">
                ⚡️ 已經有超過 <span className="bg-[#111111] text-[#FFD600] px-1.5 py-0.5 font-black">1,000+ 名</span> 外送合作騎士在各城市、大街小巷中奔馳，創造百萬次品牌曝光。
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* RIDER SECTION - Calculator */}
      <section id="rider-section" className="py-24 bg-[#FFFDF0] relative border-b-4 border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-block px-3 py-1 border-2 border-[#111111] bg-[#FFD600] text-[#111111] text-xs font-black uppercase tracking-widest">
              我是外送騎士 ‧ 合作津貼方案
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111111] uppercase tracking-tighter">
              跑單同時賺外快，每月加薪超簡單！
            </h2>
            <p className="text-slate-700 mt-4 text-base font-medium">
              我們不抽成，也不干涉您的接單。只需在原有的擋泥板安裝穿巷廣告，即可獲得穩定的每月現金津貼，為您的荷包大加分。
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Single High-Impact Showcase Card */}
            <div className="bg-white border-4 border-[#111111] rounded-none p-8 sm:p-12 brutalist-shadow space-y-8">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-4 border-dashed border-[#111111]">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-black text-[#111111] bg-[#FFD600] border-2 border-[#111111] px-3 py-1 uppercase tracking-wider inline-block">
                    熱門合作版位
                  </span>
                  <h3 className="text-3xl font-black text-[#111111] flex items-center justify-center md:justify-start gap-2">
                    <Bike className="w-8 h-8 text-[#111111]" />
                    機車擋泥板廣告
                  </h3>
                  <p className="text-sm text-slate-500 font-bold">
                    裝上本公司的擋泥板、廣告膠條貼於外送箱上方，每月達成目標準時入帳!
                  </p>
                </div>

                <div className="bg-[#FFD600] border-4 border-[#111111] p-6 text-center shrink-0 w-full md:w-auto min-w-[280px] brutalist-shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#111111] opacity-80 block">COOPERATION ALLOWANCE</span>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between font-black text-base border-b-2 border-[#111111]/20 pb-1.5">
                      <span>首月津貼：</span>
                      <span className="text-xl font-mono text-[#111111] bg-white px-2 py-0.5 border border-[#111111]">NT$ 1,000 / 月</span>
                    </div>
                    <div className="flex items-center justify-between font-black text-base pt-1.5">
                      <span>次月津貼：</span>
                      <span className="text-xl font-mono text-[#111111] bg-white px-2 py-0.5 border border-[#111111]">NT$ 500 / 月</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bullet points and highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto gap-6 text-sm">
                <div className="space-y-2 bg-[#FFFDF0] border-2 border-[#111111] p-5 brutalist-shadow-sm">
                  <div className="w-9 h-9 bg-[#111111] text-[#FFD600] flex items-center justify-center font-black rounded-none">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-base text-[#111111]">100% 額外被動收入</h4>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    與您的外送接單完全不衝突，只需維持平日跑單習慣，安裝即享雙月穩定收益。
                  </p>
                </div>

                <div className="space-y-2 bg-[#FFFDF0] border-2 border-[#111111] p-5 brutalist-shadow-sm">
                  <div className="w-9 h-9 bg-[#111111] text-[#FFD600] flex items-center justify-center font-black rounded-none">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-base text-[#111111]">安全合法合規</h4>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    完全符合交通監理機關車體廣告標示法規。無反光、無遮蔽車牌問題，守法跑單免煩惱。
                  </p>
                </div>
              </div>

              {/* Community Supervision & Referral System */}
              <div className="border-t-4 border-dashed border-[#111111] pt-8 space-y-6">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 border-2 border-[#111111] bg-[#111111] text-[#FFD600] text-xs font-black uppercase tracking-widest brutalist-shadow-sm">
                    加碼收益 ‧ 推薦與監督獎勵機制
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: 檢舉獎金機制 */}
                  <div className="bg-white border-4 border-[#111111] p-6 brutalist-shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 text-[#111111] border-2 border-[#111111] flex items-center justify-center font-black rounded-none shrink-0">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-black text-base text-[#111111]">檢舉獎金機制</h4>
                      </div>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">
                        為維護廣告執行品質，我們實施全民監督：
                      </p>
                      <ul className="text-xs text-slate-600 font-bold space-y-1.5 list-disc list-inside">
                        <li>若發現外送箱帶有廣告膠條，卻無擋泥板者。</li>
                        <li>若發現裝有廣告擋泥板，卻無外送箱廣告膠條者。</li>
                      </ul>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">
                        以上兩種情形皆可拍照進行檢舉。
                      </p>
                    </div>
                    <div className="bg-red-50 border-2 border-red-500 text-red-700 p-2 text-center font-black text-xs mt-4">
                      ★ 每成功檢舉一人，即獲 NT$ 200 檢舉獎金！
                    </div>
                  </div>

                  {/* Card 2: 邀請好友機制 */}
                  <div className="bg-white border-4 border-[#111111] p-6 brutalist-shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-400 text-[#111111] border-2 border-[#111111] flex items-center justify-center font-black rounded-none shrink-0">
                          <Users className="w-4 h-4 text-[#111111]" />
                        </div>
                        <h4 className="font-black text-base text-[#111111]">騎士推薦邀請機制</h4>
                      </div>
                      <p className="text-xs text-slate-600 font-bold leading-relaxed">
                        好康逗相報！推薦您的外送夥伴加入「穿巷騎士」行列。攜手讓廣告在城市大街小巷中擴散，一起賺取更豐厚的被動津貼收益！
                      </p>
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 p-2 text-center font-black text-xs mt-4">
                      ★ 每成功邀請一名外送員加入，即享 NT$ 100 邀請獎金！
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 text-center">
                <button 
                  onClick={() => openFormWithRole('rider')}
                  className="px-8 py-4 w-full md:w-auto font-black text-lg uppercase tracking-wider text-[#FFD600] bg-[#111111] border-4 border-[#111111] hover:bg-white hover:text-[#111111] brutalist-shadow transition-all duration-200 text-center inline-flex items-center justify-center gap-2"
                >
                  <Bike className="w-5 h-5" />
                  <span>立即線上報名 ‧ 搶先卡位</span>
                </button>
                <p className="text-[10px] text-slate-500 font-bold mt-3">
                  * 實際合作將依車款、常跑行政區與首輪配對之廣告品牌額滿狀況而定。
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CORE BENEFITS / BENTO GRID */}
      <section id="benefits-section" className="py-24 bg-white border-b-4 border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-block px-3 py-1 border-2 border-[#111111] bg-[#FFD600] text-[#111111] text-xs font-black uppercase tracking-widest">
              穿巷核心優勢
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111111] uppercase tracking-tighter">
              開創「移動、精準、高回頭率」的廣告新時代
            </h2>
            <p className="text-slate-700 mt-4 text-base font-medium">
              不論您是需要高流量轉化的品牌主，還是追求更優渥被動收入的外送夥伴，穿巷都是您最堅實的商務引擎。
            </p>
          </div>

          {/* Bento style grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-6 lg:gap-8">
            
            {/* Card 1: 穿透力超群 (Advertisers) */}
            <div className="bg-white border-4 border-[#111111] rounded-none p-8 flex flex-col justify-between hover:-translate-y-1 hover:bg-[#FFD600]/10 transition-all duration-200 brutalist-shadow group">
              <div className="space-y-4">
                <div className="w-12 h-12 border-2 border-[#111111] bg-[#FFD600] text-[#111111] flex items-center justify-center rounded-none group-hover:scale-105 transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#111111]">極高巷弄穿透力</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  傳統公車或捷運看板只能停留在主要幹道。穿巷騎士每日進入住宅區巷弄、大樓中庭、商務辦公區，讓您的廣告深入公車到不了的地方。
                </p>
              </div>
              <div className="pt-6 border-t-2 border-[#111111] mt-6 text-xs font-black text-[#111111] flex items-center gap-1 uppercase tracking-wider">
                <span>深入城市微血管</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: 實時GPS追蹤 (Advertisers) */}
            <div className="bg-white border-4 border-[#111111] rounded-none p-8 flex flex-col justify-between hover:-translate-y-1 hover:bg-[#FFD600]/10 transition-all duration-200 brutalist-shadow group">
              <div className="space-y-4">
                <div className="w-12 h-12 border-2 border-[#111111] bg-[#FFD600] text-[#111111] flex items-center justify-center rounded-none group-hover:scale-105 transition-all">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#111111]">實時里程數據驗收</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  徹底告別傳統戶外廣告「看天吃飯、無法量化」的缺點。提供完整騎士行車熱點分佈地圖、GPS 里程驗收數據、每月高清實拍照片報告。
                </p>
              </div>
              <div className="pt-6 border-t-2 border-[#111111] mt-6 text-xs font-black text-[#111111] flex items-center gap-1 uppercase tracking-wider">
                <span>讓預算花得一清二楚</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: 等紅燈黃金視線 (Advertisers) */}
            <div className="bg-white border-4 border-[#111111] rounded-none p-8 flex flex-col justify-between hover:-translate-y-1 hover:bg-[#FFD600]/10 transition-all duration-200 brutalist-shadow group">
              <div className="space-y-4">
                <div className="w-12 h-12 border-2 border-[#111111] bg-[#FFD600] text-[#111111] flex items-center justify-center rounded-none group-hover:scale-105 transition-all">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#111111]">等紅燈黃金視線 ‧ 街頭霸權矩陣</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  配合外送員長期在外奔波，在群眾等紅燈左顧右盼的黃金時刻，達到100%吸睛效果。相比計程車保險桿單一零散的特點，穿巷騎士集體停等能瞬間形成「強大矩陣效應」，輕易被全場聚焦！
                </p>
              </div>
              <div className="pt-6 border-t-2 border-[#111111] mt-6 text-xs font-black text-[#111111] flex items-center gap-1 uppercase tracking-wider">
                <span>紅燈時刻的專注焦點</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS / TIMELINE */}
      <section className="py-24 bg-[#FFFDF0] border-b-4 border-[#111111] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left: Riders path */}
            <div className="space-y-8 bg-white p-6 sm:p-10 rounded-none border-4 border-[#111111] brutalist-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-[#111111] rounded-none bg-[#FFD600] flex items-center justify-center text-[#111111] font-black text-lg">
                  1
                </div>
                <h3 className="text-2xl font-black text-[#111111]">騎士申請四部曲</h3>
              </div>
              <p className="text-slate-700 font-bold text-sm">
                簡單四步驟，收到寄送包裹後自行快速安裝，即可開始累積廣告收益！
              </p>

              <div className="space-y-6 pt-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-[40px] bottom-[40px] w-0.5 bg-[#111111]" />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-white text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    01
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">線上預約報名</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">填寫下方申請表單，並上傳您的外送箱款式與常跑行政區。</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-white text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    02
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">擋泥板寄送</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">填寫寄送地址，您只需負擔運費即可寄送到府！</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-white text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    03
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">安裝擋泥板與膠條</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">收到包裹後自行輕鬆安裝！簡單對位鎖固擋泥板，並將廣告膠條貼於外送箱上方。</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-[#FFD600] text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    04
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">安心上路，每月 10 號結算</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">達成基本外送時數或單數即可領取！截圖您的外送平台數據送出核實，被動收入次月匯至指定帳戶。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Advertiser path */}
            <div className="space-y-8 bg-white p-6 sm:p-10 rounded-none border-4 border-[#111111] brutalist-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-[#111111] rounded-none bg-[#FFD600] flex items-center justify-center text-[#111111] font-black text-lg">
                  2
                </div>
                <h3 className="text-2xl font-black text-[#111111]">品牌主合作流程</h3>
              </div>
              <p className="text-slate-700 font-bold text-sm">
                快速配置專屬城市移動宣傳車隊，鎖定高轉換潛力客群。
              </p>

              <div className="space-y-6 pt-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-[40px] bottom-[40px] w-0.5 bg-[#111111]" />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-white text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    01
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">提出預算與目標地區</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">線上諮詢，告知您的品牌調性、希望覆蓋的商圈或主要外送時段。</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-white text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    02
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">視覺設計與騎士媒合</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">穿巷專屬設計師精準套印廣告排版，並透過後台自動篩選常在該行政區上線的資深外送員。</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-none border-2 border-[#111111] bg-[#FFD600] text-[#111111] font-black text-sm flex items-center justify-center shrink-0 shadow">
                    03
                  </div>
                  <div>
                    <h4 className="font-black text-[#111111] text-base">車隊出發 ‧ 實時監測</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">專屬移動車隊上線！您可以透過企業後台儀表板，隨時追蹤總行駛里程與熱區曝光圖。</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq-section" className="py-24 bg-white border-b-4 border-[#111111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-3 py-1 border-2 border-[#111111] bg-[#FFD600] text-[#111111] text-xs font-black uppercase tracking-widest">
              答疑解惑
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111111] uppercase tracking-tighter">
              常見問題與騎士回覆
            </h2>
            <p className="text-slate-700 mt-4 text-sm sm:text-base font-medium">
              在加入我們之前，還有疑惑嗎？我們為騎士與廣告主整理了最常見的合作問題。
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`border-2 border-[#111111] rounded-none overflow-hidden transition-all duration-200 ${
                    isOpen ? 'border-4 bg-[#FFD600]/10 brutalist-shadow-sm' : 'bg-white hover:bg-[#FFFDF0]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-black text-[#111111] text-sm sm:text-base flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[#111111]' : 'text-slate-500'}`} />
                      {faq.q}
                    </span>
                    <span className={`p-1.5 border-2 border-[#111111] rounded-none ${isOpen ? 'bg-[#FFD600] text-[#111111]' : 'bg-white text-[#111111]'}`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-700 font-medium leading-relaxed border-t-2 border-[#111111] pt-4 bg-white">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION & FORM */}
      <section className="py-24 bg-[#FFFDF0] relative overflow-hidden border-b-4 border-[#111111]" id="form-section">
        {/* Subtle dot background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="bg-white border-4 border-[#111111] rounded-none p-6 sm:p-10 brutalist-shadow">
            
            {/* Role Tab Toggle inside Form Card */}
            <div className="flex p-1 rounded-none border-2 border-[#111111] bg-[#FFFDF0] gap-1 mb-8">
              <button
                onClick={() => {
                  setUserRole('rider');
                  setFormSubmitted(false);
                }}
                className={`flex-1 py-3 text-center rounded-none text-sm font-black transition-all flex items-center justify-center gap-2 border-2 ${
                  userRole === 'rider' 
                    ? 'bg-[#FFD600] text-[#111111] border-[#111111] shadow-sm' 
                    : 'bg-transparent text-slate-500 border-transparent hover:text-[#111111]'
                }`}
              >
                <Bike className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>我是外送騎士 (申請被動加薪)</span>
              </button>
              <button
                onClick={() => {
                  setUserRole('advertiser');
                  setFormSubmitted(false);
                }}
                className={`flex-1 py-3 text-center rounded-none text-sm font-black transition-all flex items-center justify-center gap-2 border-2 ${
                  userRole === 'advertiser' 
                    ? 'bg-[#111111] text-[#FFD600] border-[#111111] shadow-sm' 
                    : 'bg-transparent text-slate-500 border-transparent hover:text-[#111111]'
                }`}
              >
                <Megaphone className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>我是廣告主 (洽詢宣傳合作)</span>
              </button>
            </div>

            <div className="mb-8 text-center sm:text-left space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tighter">
                {userRole === 'rider' ? '加入穿巷騎士 ‧ 行車安心多份薪' : '索取穿巷外送移動廣告企劃書'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                {userRole === 'rider' 
                  ? '只需 1 分鐘填寫基本資料，我們將在 24 小時內聯絡您，安排最鄰近的加盟技師安裝！' 
                  : '專人顧問將為您分析產業投放效益，提供高成效的商圈曝光規劃與檔期客製化優惠。'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 bg-emerald-50 border-4 border-[#111111] rounded-none text-center space-y-6 brutalist-shadow-sm"
                >
                  <div className="w-16 h-16 bg-[#FFD600] text-[#111111] border-2 border-[#111111] rounded-none flex items-center justify-center mx-auto shadow">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#111111]">
                      {userRole === 'rider' ? '報名成功！您的加薪邀請函已送出' : '諮詢表單已成功提交！'}
                    </h4>
                    <p className="text-sm text-slate-700 mt-2 font-bold">
                      {userRole === 'rider' 
                        ? '穿巷團隊正快馬加鞭審核您的車體資訊。我們會在 24 小時內發送手機簡訊與 LINE 預約安裝時間。' 
                        : '感謝您的諮詢！我們的品牌行銷顧問將在 1 個工作天內（週一至週五 9:00 - 18:00）透過電子郵件或電話與您聯繫。'}
                    </p>
                  </div>
                  
                  {/* Summary of submitted mock details */}
                  <div className="bg-white rounded-none p-5 text-left border-2 border-[#111111] text-xs space-y-2.5 max-w-sm mx-auto shadow-sm">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-bold">申請人姓名:</span>
                      <span className="font-black text-[#111111]">{formData.name || '王先生/小姐'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-bold">聯絡電話:</span>
                      <span className="font-black text-[#111111]">{formData.phone || '0912-345-678'}</span>
                    </div>
                    {userRole === 'rider' ? (
                      <>
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500 font-bold">運作地區:</span>
                          <span className="font-black text-[#111111]">{formData.city || '雙北地區'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">外送平台:</span>
                          <span className="font-black text-[#111111]">
                            {formData.deliveryPlatform === 'both' ? 'Uber Eats & Foodpanda 雙棲' : 
                             formData.deliveryPlatform === 'uber' ? 'Uber Eats' : 'Foodpanda'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500 font-bold">公司/品牌名稱:</span>
                          <span className="font-black text-[#111111]">{formData.companyName || '您的公司行號'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">預算規模:</span>
                          <span className="font-black text-[#111111]">
                            {formData.budget === 'under-5w' ? '5 萬以下 (試辦首期)' : 
                             formData.budget === '5w-20w' ? '5 萬 - 20 萬 (標準方案)' : '20 萬以上 (全省車隊連鎖)'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Auto-reset Countdown Controller */}
                  <div className="pt-4 border-t-2 border-dashed border-[#111111] max-w-sm mx-auto space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-white border border-[#111111] px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-4 h-4 text-[#FF5A00] ${isCountdownPaused ? '' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />
                        <span>
                          {isCountdownPaused 
                            ? '自動重置：已暫停' 
                            : `系統將在 ${countdown} 秒後自動重置`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCountdownPaused(!isCountdownPaused)}
                        className="px-2 py-0.5 border border-[#111111] bg-[#FFD600] text-[#111111] font-black hover:bg-white text-[10px] rounded-none transition-all"
                      >
                        {isCountdownPaused ? '繼續' : '暫停'}
                      </button>
                    </div>

                    {/* Interactive Animated Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 border-2 border-[#111111] rounded-none overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FF5A00] to-[#FFD600] transition-all duration-1000 ease-linear"
                        style={{ width: `${(countdown / 8) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setIsCountdownPaused(true);
                      }}
                      className="px-6 py-2.5 border-2 border-[#111111] bg-white text-[#111111] font-black hover:bg-[#FFD600] transition-all rounded-none text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      再次填寫或修改資料
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key={userRole}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Common Field: Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                        <User className="w-4 h-4 text-[#111111]" />
                        <span>您的中文姓名 *</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                        placeholder="例：王小明"
                      />
                    </div>

                    {/* Common Field: Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                        <Phone className="w-4 h-4 text-[#111111]" />
                        <span>手機號碼 *</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        pattern="^09[0-9]{8}$"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                        placeholder="例：0912345678"
                      />
                    </div>
                  </div>

                  {/* Common Field: Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                      <Mail className="w-4 h-4 text-[#111111]" />
                      <span>常用電子郵件 *</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                      placeholder="例：yourname@gmail.com"
                    />
                  </div>

                  {/* Dynamic Fields for Rider Path */}
                  {userRole === 'rider' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                          <MapPin className="w-4 h-4 text-[#111111]" />
                          <span>常跑外送縣市 *</span>
                        </label>
                        <select 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value, selectedDistricts: []})}
                          className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111] bg-white appearance-none"
                        >
                          <option value="">請選擇</option>
                          <option value="台北市">台北市</option>
                          <option value="新北市">新北市</option>
                          <option value="桃園市">桃園市</option>
                          <option value="台中市">台中市</option>
                          <option value="台南市">台南市</option>
                          <option value="高雄市">高雄市</option>
                          <option value="其他縣市">其他縣市</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                          <Bike className="w-4 h-4 text-[#111111]" />
                          <span>外送箱款式與平台 *</span>
                        </label>
                        <select 
                          value={formData.deliveryPlatform}
                          onChange={(e) => setFormData({...formData, deliveryPlatform: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111] bg-white appearance-none"
                        >
                          <option value="both">雙平台 (Uber Eats & Foodpanda)</option>
                          <option value="uber">僅跑 Uber Eats</option>
                          <option value="panda">僅跑 Foodpanda</option>
                          <option value="foodomo">foodomo 外送</option>
                          <option value="lalamove">Lalamove / 快遞 / 其他</option>
                        </select>
                      </div>

                      {/* Dynamic District Multi-Selector */}
                      {formData.city && CITY_DISTRICTS[formData.city] && (
                        <div className="col-span-1 sm:col-span-2 space-y-2 border-2 border-[#111111] bg-white p-4">
                          <label className="text-xs font-black text-[#111111] block uppercase tracking-wider">
                            選擇常跑行政區 (可複選) *
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {CITY_DISTRICTS[formData.city].map((dist) => {
                              const isChecked = formData.selectedDistricts.includes(dist);
                              return (
                                <label 
                                  key={dist} 
                                  className={`flex items-center gap-2 p-2 border-2 text-xs font-bold cursor-pointer select-none transition-all ${
                                    isChecked 
                                      ? 'bg-[#FFD600] border-[#111111] text-[#111111]' 
                                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <input 
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isChecked}
                                    onChange={() => {
                                      const nextDistricts = isChecked 
                                        ? formData.selectedDistricts.filter(d => d !== dist)
                                        : [...formData.selectedDistricts, dist];
                                      setFormData({
                                        ...formData,
                                        selectedDistricts: nextDistricts
                                      });
                                    }}
                                  />
                                  <span>{dist}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Shipping Address Field */}
                      <div className="col-span-1 sm:col-span-2 space-y-2">
                        <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                          <MapPin className="w-4 h-4 text-[#111111]" />
                          <span>收件聯絡地址 / 住址 * (寄送擋泥板及膠條用)</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                          placeholder="例：106 台北市大安區忠孝東路四段 XX 號 X 樓"
                        />
                      </div>

                      {/* Bank Account for allowance */}
                      <div className="col-span-1 sm:col-span-2 space-y-2">
                        <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                          <DollarSign className="w-4 h-4 text-[#111111]" />
                          <span>銀行帳號 * (匯款廣告津貼用)</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.bankAccount}
                          onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                          placeholder="例：中國信託 (822) 123456789012"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Dynamic Fields for Advertiser Path */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                          <Briefcase className="w-4 h-4 text-[#111111]" />
                          <span>公司名稱/品牌行號 *</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                          placeholder="例：穿巷商務股份有限公司"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#111111] flex items-center gap-1.5 uppercase">
                          <DollarSign className="w-4 h-4 text-[#111111]" />
                          <span>宣傳預算規模 *</span>
                        </label>
                        <select 
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111] bg-white appearance-none"
                        >
                          <option value="under-5w">NT$ 5 萬以下 (試辦首期體驗)</option>
                          <option value="5w-20w">NT$ 5 萬 - 20 萬 (區域推廣主打)</option>
                          <option value="20w-50w">NT$ 20 萬 - 50 萬 (跨行政區連鎖覆蓋)</option>
                          <option value="above-50w">NT$ 50 萬以上 (大型全台宣傳)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Message/Comments */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#111111] block uppercase">備註說明 / 欲了解細節</label>
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                      placeholder={userRole === 'rider' ? '例：我的車款是 SYM Jet SL，外送箱是官方大箱，通常跑大安區一帶...' : '例：希望能針對新北板橋與中和區進行手搖飲新品推廣，預計 10 月初開跑...'}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-none border-4 border-[#111111] text-[#111111] font-black transition-all duration-200 text-center flex items-center justify-center gap-2 ${
                        isSubmitting ? 'bg-slate-300 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-[#FFD600] hover:bg-[#FFE34D] brutalist-shadow'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-b-2 border-[#111111] rounded-full animate-spin" />
                          <span>資料儲存中，請稍候...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 stroke-[2.5]" />
                          <span>{userRole === 'rider' ? '遞交申請 ‧ 馬上獲得被動加薪機會' : '提交需求 ‧ 預約行銷專家免費一對一規劃'}</span>
                        </>
                      )}
                    </button>
                    {submitError && (
                      <div className="mt-3 text-xs font-black text-red-600 bg-red-50 border-2 border-red-500 p-2 text-center">
                        ⚠️ {submitError}
                      </div>
                    )}
                    <p className="text-[10px] text-center text-slate-500 mt-3 font-bold">
                      🔒 本服務嚴格遵守個資安全法規範。您的聯絡資訊僅用於穿巷業務配對與合作預約，絕不洩漏第三方。
                    </p>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-[#E2E8F0] py-16 border-t-4 border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Branding Column */}
            <div className="space-y-5 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 border-2 border-[#111111] bg-[#FFD600] flex items-center justify-center text-[#111111] font-black">
                  <Bike className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-sans font-black text-2xl text-white tracking-widest uppercase">穿巷外送廣告</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-medium">
                全台最專業的外送機車移動式廣告媒合平台。我們利用機車擋泥板與外送箱空間，為騎士搭建每月被動收入，同時為品牌主打通穿透城市每條巷弄的百萬曝光管道。
              </p>
              <div className="flex gap-4 text-xs font-black pt-2 text-[#FFD600]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                  <span>週一至週五 09:00 - 18:00</span>
                </div>
              </div>
            </div>

            {/* Quick Links Riders */}
            <div className="space-y-4">
              <h4 className="text-white text-sm font-black tracking-wider uppercase border-l-4 border-[#FFD600] pl-2.5">騎士專區</h4>
              <ul className="text-xs space-y-2.5 font-bold">
                <li><a href="#rider-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">被動收益計算機</a></li>
                <li><a href="#form-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">線上申請加入</a></li>
                <li><a href="#benefits-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">技師安裝規範</a></li>
                <li><a href="#faq-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">常見問題</a></li>
              </ul>
            </div>

            {/* Quick Links Advertisers */}
            <div className="space-y-4">
              <h4 className="text-white text-sm font-black tracking-wider uppercase border-l-4 border-[#FFD600] pl-2.5">品牌主合作</h4>
              <ul className="text-xs space-y-2.5 font-bold">
                <li><a href="#benefits-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">品牌宣傳規劃</a></li>
                <li><a href="#benefits-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">數據追蹤優勢</a></li>
                <li><a href="#form-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">聯絡顧問簡報</a></li>
                <li><a href="#faq-section" className="text-slate-400 hover:text-[#FFD600] transition-colors">廣告尺寸規範</a></li>
              </ul>
            </div>

          </div>

          {/* Legal / Copyright Bottom */}
          <div className="border-t-2 border-[#333333] pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4 font-bold">
            <div>
              &copy; {new Date().getFullYear()} 穿巷外送移動廣告股份有限公司 (ChuanXiang Ads Corp). All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300">隱私權政策</a>
              <a href="#" className="hover:text-slate-300">騎士服務條款</a>
              <a href="#" className="hover:text-slate-300">交通法規合規聲明</a>
            </div>
          </div>

        </div>
      </footer>

      {/* POPUP / MODAL FORM for quick trigger buttons */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-none w-full max-w-2xl overflow-y-auto max-h-[90vh] relative z-10 border-4 border-[#111111] brutalist-shadow"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 border-2 border-[#111111] bg-white rounded-none text-[#111111] hover:bg-[#FFD600] transition-all"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
              
              <div className="p-6 sm:p-8">
                
                {/* Form header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 border-2 border-[#111111] bg-[#FFD600] flex items-center justify-center text-[#111111] font-black rounded-none">
                    {userRole === 'rider' ? <Bike className="w-5 h-5 stroke-[2.5]" /> : <Megaphone className="w-5 h-5 stroke-[2.5]" />}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#111111] uppercase tracking-tighter">
                      {userRole === 'rider' ? '立即加入「穿巷騎士」' : '預約穿巷專業廣告規劃'}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      請填寫下方資料，我們將在一個工作天內安排專員與您聯繫。
                    </p>
                  </div>
                </div>

                 {formSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-[#FFD600] text-[#111111] border-2 border-[#111111] rounded-none flex items-center justify-center mx-auto shadow">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#111111]">感謝您的報名！</h4>
                      <p className="text-sm text-slate-700 mt-2 font-bold">
                        專員正加急處理您的需求。我們將在 24 小時內發送預約簡訊或聯絡電話。
                      </p>
                    </div>

                    {/* Auto-reset Countdown Controller */}
                    <div className="pt-4 border-t-2 border-dashed border-[#111111] max-w-sm mx-auto space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-white border border-[#111111] px-3 py-2 text-left">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-4 h-4 text-[#FF5A00] ${isCountdownPaused ? '' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />
                          <span>
                            {isCountdownPaused 
                              ? '自動關閉：已暫停' 
                              : `視窗將在 ${countdown} 秒後自動關閉`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCountdownPaused(!isCountdownPaused)}
                          className="px-2 py-0.5 border border-[#111111] bg-[#FFD600] text-[#111111] font-black hover:bg-white text-[10px] rounded-none transition-all"
                        >
                          {isCountdownPaused ? '繼續' : '暫停'}
                        </button>
                      </div>

                      {/* Interactive Animated Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 border-2 border-[#111111] rounded-none overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF5A00] to-[#FFD600] transition-all duration-1000 ease-linear"
                          style={{ width: `${(countdown / 8) * 100}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        // Reset form
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          city: '',
                          scooterModel: '',
                          deliveryPlatform: 'both',
                          companyName: '',
                          budget: 'under-5w',
                          message: '',
                          dailyHours: '6',
                          weeklyDays: '5',
                          primaryRegion: '',
                          address: '',
                          bankAccount: '',
                          selectedDistricts: []
                        });
                        setFormSubmitted(false);
                      }}
                      className="px-6 py-2.5 border-2 border-[#111111] bg-[#111111] text-white font-black hover:bg-[#FFD600] hover:text-[#111111] rounded-none transition-all shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      關閉視窗 (立即重置)
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    
                    {/* Select role in modal too */}
                    <div className="flex bg-[#FFFDF0] p-1 border-2 border-[#111111] rounded-none text-xs font-black gap-1 mb-4">
                      <button
                        type="button"
                        onClick={() => setUserRole('rider')}
                        className={`flex-1 py-2 rounded-none text-center ${userRole === 'rider' ? 'bg-[#FFD600] text-[#111111] border-2 border-[#111111] shadow-none' : 'text-slate-500'}`}
                      >
                        我是外送騎士
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserRole('advertiser')}
                        className={`flex-1 py-2 rounded-none text-center ${userRole === 'advertiser' ? 'bg-[#111111] text-[#FFD600] border-2 border-[#111111] shadow-none' : 'text-slate-500'}`}
                      >
                        我是廣告主
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-black text-[#111111] block uppercase">姓名 *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                          placeholder="例：林大文"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-[#111111] block uppercase">手機號碼 *</label>
                        <input 
                          type="tel" 
                          required
                          pattern="^09[0-9]{8}$"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                          placeholder="例：0912345678"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-[#111111] block uppercase">常用電子信箱 *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2.5 border-2 border-[#111111] text-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold"
                        placeholder="例：example@mail.com"
                      />
                    </div>

                    {userRole === 'rider' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                        <div className="space-y-1">
                          <label className="text-xs font-black text-[#111111] block uppercase">常跑外送縣市 *</label>
                          <select 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value, selectedDistricts: []})}
                            className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111] bg-white appearance-none"
                          >
                            <option value="">請選擇</option>
                            <option value="台北市">台北市</option>
                            <option value="新北市">新北市</option>
                            <option value="桃園市">桃園市</option>
                            <option value="台中市">台中市</option>
                            <option value="台南市">台南市</option>
                            <option value="高雄市">高雄市</option>
                            <option value="其他縣市">其他縣市</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-black text-[#111111] block uppercase">外送平台與款式 *</label>
                          <select 
                            value={formData.deliveryPlatform}
                            onChange={(e) => setFormData({...formData, deliveryPlatform: e.target.value})}
                            className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111] bg-white appearance-none"
                          >
                            <option value="both">雙平台 (Uber Eats & Foodpanda)</option>
                            <option value="uber">僅跑 Uber Eats</option>
                            <option value="panda">僅跑 Foodpanda</option>
                            <option value="foodomo">foodomo 外送</option>
                            <option value="lalamove">Lalamove / 快遞 / 其他</option>
                          </select>
                        </div>

                        {/* Dynamic District Multi-Selector */}
                        {formData.city && CITY_DISTRICTS[formData.city] && (
                          <div className="col-span-1 sm:col-span-2 space-y-2 border-2 border-[#111111] bg-white p-3">
                            <label className="text-xs font-black text-[#111111] block uppercase tracking-wider">
                              選擇常跑行政區 (可複選) *
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 border border-slate-200">
                              {CITY_DISTRICTS[formData.city].map((dist) => {
                                const isChecked = formData.selectedDistricts.includes(dist);
                                return (
                                  <label 
                                    key={dist} 
                                    className={`flex items-center gap-1.5 p-1.5 border-2 text-xs font-bold cursor-pointer select-none transition-all ${
                                      isChecked 
                                        ? 'bg-[#FFD600] border-[#111111] text-[#111111]' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input 
                                      type="checkbox"
                                      className="sr-only"
                                      checked={isChecked}
                                      onChange={() => {
                                        const nextDistricts = isChecked 
                                          ? formData.selectedDistricts.filter(d => d !== dist)
                                          : [...formData.selectedDistricts, dist];
                                        setFormData({
                                          ...formData,
                                          selectedDistricts: nextDistricts
                                        });
                                      }}
                                    />
                                    <span>{dist}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Shipping Address field */}
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-xs font-black text-[#111111] block uppercase">收件聯絡地址 / 住址 * (寄送擋泥板及膠條用)</label>
                          <input 
                            type="text" 
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                            placeholder="例：106 台北市大安區忠孝東路四段 XX 號 X 樓"
                          />
                        </div>

                        {/* Bank Account for allowance */}
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-xs font-black text-[#111111] block uppercase">銀行帳號 * (匯款廣告津貼用)</label>
                          <input 
                            type="text" 
                            required
                            value={formData.bankAccount}
                            onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                            className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                            placeholder="例：中國信託 (822) 123456789012"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-black text-[#111111] block uppercase">公司名稱 *</label>
                          <input 
                            type="text" 
                            required
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                            placeholder="公司全名或品牌簡稱"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-black text-[#111111] block uppercase">宣傳預算等級 *</label>
                          <select 
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111] bg-white appearance-none"
                          >
                            <option value="under-5w">NT$ 5 萬以下</option>
                            <option value="5w-20w">NT$ 5 萬 - 20 萬</option>
                            <option value="20w-50w">NT$ 20 萬 - 50 萬</option>
                            <option value="above-50w">NT$ 50 萬以上</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-black text-[#111111] block uppercase">需求描述 / 補充說明</label>
                      <textarea 
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-3 py-2.5 border-2 border-[#111111] rounded-none focus:outline-none focus:bg-[#FFFDF0] focus:ring-0 text-sm font-bold text-[#111111]"
                        placeholder="有任何特殊需求或提問，都歡迎在此填寫..."
                      />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      {submitError && (
                        <div className="text-xs font-black text-red-600 bg-red-50 border-2 border-red-500 p-2 text-center">
                          ⚠️ {submitError}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button 
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 py-3 border-2 border-[#111111] bg-white text-[#111111] font-black rounded-none text-sm hover:bg-slate-50 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          取消
                        </button>
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className={`flex-1 py-3 border-2 border-[#111111] text-[#111111] font-black rounded-none text-sm transition-all text-center flex items-center justify-center gap-1.5 ${
                            isSubmitting ? 'bg-slate-200 cursor-not-allowed' : 'bg-[#FFD600] hover:bg-[#FFE34D] brutalist-shadow-sm'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-t-2 border-b-2 border-[#111111] rounded-full animate-spin" />
                              <span>儲存中...</span>
                            </>
                          ) : (
                            <span>送出申請</span>
                          )}
                        </button>
                      </div>
                    </div>

                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

