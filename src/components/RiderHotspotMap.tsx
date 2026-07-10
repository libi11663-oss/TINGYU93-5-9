import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Clock, 
  Flame, 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  Check, 
  ChevronRight,
  Eye,
  Percent,
  Compass
} from 'lucide-react';

interface DistrictData {
  id: string;
  name: string;
  engName: string;
  points: string;
  center: { x: number; y: number };
  baseRiders: number;
  baseImpressions: number;
  roiScore: number;
  hotspots: string[];
  peakTimes: string;
  mainCategories: string[];
  description: string;
}

const DISTRICTS_DATA: Record<string, DistrictData> = {
  shilin: {
    id: 'shilin',
    name: '士林北投區',
    engName: 'Shilin & Beitou',
    points: '90,20 170,20 160,70 100,70',
    center: { x: 130, y: 45 },
    baseRiders: 120,
    baseImpressions: 2800000,
    roiScore: 88,
    hotspots: ['士林夜市', '天母運動公園', '捷運芝山站'],
    peakTimes: '17:30 - 21:30 (晚餐/夜市)',
    mainCategories: ['夜市小吃', '住宅晚餐', '下午茶點心'],
    description: '雙北最大夜市與住宅聚落，晚餐與宵夜時段外送車流量驚人。機車穿梭率極高，適合大眾休閒、旅遊與餐飲品牌投放。'
  },
  zhongshan: {
    id: 'zhongshan',
    name: '中山區',
    engName: 'Zhongshan District',
    points: '100,70 160,70 155,120 115,120',
    center: { x: 132, y: 95 },
    baseRiders: 160,
    baseImpressions: 4200000,
    roiScore: 95,
    hotspots: ['南西商圈', '晴光市場', '捷運松江南京'],
    peakTimes: '11:30 - 13:30 (中午辦公室), 18:00 - 22:00 (宵夜娛樂)',
    mainCategories: ['上班族午餐', '居酒屋宵夜', '精品網美茶飲'],
    description: '經典的住辦混合精華區。白天有海量的商務午餐訂單，夜晚林森北路與條通一帶娛樂宵夜熱絡，是全天候、全天時段曝光的首選戰區。'
  },
  neihu: {
    id: 'neihu',
    name: '內湖區',
    engName: 'Neihu Technology Park',
    points: '160,70 250,70 250,120 185,120 170,95',
    center: { x: 205, y: 95 },
    baseRiders: 150,
    baseImpressions: 3800000,
    roiScore: 92,
    hotspots: ['內湖科技園區', '捷運港墘站', '大潤發量販商圈'],
    peakTimes: '11:30 - 13:30 (午餐極峰), 15:00 - 16:30 (下午茶)',
    mainCategories: ['科技業辦公室午餐', '會議下午茶', '量販生活圈'],
    description: '內湖科學園區擁有全台密度最高的白領外送訂單。中午與下午茶時段外送機車塞爆各棟總部大樓，是 B2B、科技軟體、金融理財廣告的黃金板位。'
  },
  daan: {
    id: 'daan',
    name: '大安區',
    engName: 'Daan District',
    points: '115,120 170,120 165,180 120,180',
    center: { x: 142, y: 150 },
    baseRiders: 195,
    baseImpressions: 5400000,
    roiScore: 98,
    hotspots: ['東區商圈', '信義安和/通化街', '台灣大學/公館'],
    peakTimes: '11:30 - 13:30 (商務午餐), 17:30 - 20:00 (潮流晚餐)',
    mainCategories: ['高檔餐飲', '手搖飲料', '學生平價美食'],
    description: '全台消費力最頂級的行政區，指標性百貨與精品餐館林立。穿巷廣告在此區穿梭，能直接接觸到含金量最高的消費主力與年輕群眾。'
  },
  xinyi: {
    id: 'xinyi',
    name: '信義區',
    engName: 'Xinyi District',
    points: '170,120 250,120 240,180 165,180',
    center: { x: 205, y: 150 },
    baseRiders: 175,
    baseImpressions: 4900000,
    roiScore: 96,
    hotspots: ['信義商圈', '市政府/台北101', '捷運永春站'],
    peakTimes: '12:00 - 14:00 (白領午餐), 18:00 - 21:00 (聚餐購物)',
    mainCategories: ['百貨精品', '商務下午茶', '頂級餐館'],
    description: '台北金融商業中樞。百貨門口常年聚集大量外送等餐車隊，擋泥板與箱體在信義路、忠孝東路等主要幹道紅綠燈前能獲得無與倫比的停留曝光。'
  },
  wanhua: {
    id: 'wanhua',
    name: '萬華區',
    engName: 'Wanhua / Ximending',
    points: '65,120 115,120 105,180 65,180',
    center: { x: 88, y: 150 },
    baseRiders: 110,
    baseImpressions: 2600000,
    roiScore: 87,
    hotspots: ['西門町商圈', '萬華車站', '龍山寺/廣州街夜市'],
    peakTimes: '14:00 - 22:00 (下午茶/夜間潮流人潮)',
    mainCategories: ['潮流美妝', '網紅連鎖美食', '年輕學生點心'],
    description: '西門町是雙北潮流與年輕客群大本營。下午茶與週末人潮密集，機車穿梭於大街小巷，廣告極易被學生、潮流人士及觀光客捕捉，社群傳播力極高。'
  },
  zhongyonghe: {
    id: 'zhongyonghe',
    name: '中永和區',
    engName: 'Zhonghe & Yonghe',
    points: '105,180 165,180 155,240 95,240',
    center: { x: 130, y: 210 },
    baseRiders: 155,
    baseImpressions: 3900000,
    roiScore: 91,
    hotspots: ['樂華夜市', '頂溪捷運站', '中和環球購物中心'],
    peakTimes: '07:30 - 09:30 (通勤返工), 18:00 - 21:00 (晚間送餐)',
    mainCategories: ['住宅家庭晚餐', '連鎖超市/量販', '生活日用品'],
    description: '全台人口密度最高的飽和型住宅聚落。騎士在密集的棋盤式巷弄中穿梭送餐，對於在地生活圈、家事服務與民生品牌具有極強的家戶滲透力。'
  },
  banqiao: {
    id: 'banqiao',
    name: '板橋區',
    engName: 'Banqiao District',
    points: '20,180 105,180 95,240 20,240',
    center: { x: 62, y: 210 },
    baseRiders: 180,
    baseImpressions: 4700000,
    roiScore: 94,
    hotspots: ['新板特區/板橋車站', '府中商圈', '新埔捷運商圈'],
    peakTimes: '11:30 - 13:30 (商辦午餐), 18:00 - 21:00 (家庭晚餐)',
    mainCategories: ['連鎖餐飲', '生活量販', '學區補習班'],
    description: '新北市行政與商務心臟。新板特區與府中商圈雙核心帶動，外送與民生需求常年高居新北之冠，穿巷車貼能在此發揮極高的常態重複曝光。'
  }
};

interface TimePeriod {
  label: string;
  timeRange: string;
  multiplier: number;
  activeZoneId: string;
  description: string;
}

const TIME_PERIODS: TimePeriod[] = [
  { label: '早餐通勤期', timeRange: '08:00 - 10:00', multiplier: 0.8, activeZoneId: 'zhongyonghe', description: '騎士多聚集於中永和、板橋往市中心的通勤幹道（各聯外橋樑）' },
  { label: '午餐訂單極峰', timeRange: '11:30 - 13:30', multiplier: 1.5, activeZoneId: 'neihu', description: '內科、大安與信義等商辦中心外送訂單大爆發，全台騎士最高峰在街曝曬' },
  { label: '下午茶小空檔', timeRange: '14:30 - 16:30', multiplier: 0.7, activeZoneId: 'wanhua', description: '西門町商圈與中山南西商圈下午茶點心大熱門，年輕人群體高密集曝光' },
  { label: '晚餐訂單極峰', timeRange: '17:30 - 20:00', multiplier: 1.4, activeZoneId: 'daan', description: '全區飽和式送餐！大安、信義、板橋與中永和等住宅/餐飲核心大爆發' },
  { label: '宵夜娛樂熱潮', timeRange: '21:00 - 23:30', multiplier: 0.9, activeZoneId: 'shilin', description: '士林夜市、晴光市場與樂華夜市等商圈熱絡，宵夜訂單與逛街人潮高點' }
];

// Define some static path lines for visual interest (scooter major arteries)
const ROAD_ARTERIES = [
  { name: '市民大道快速道路', d: 'M30,140 Q150,135 250,130' },
  { name: '忠孝東路幹線', d: 'M25,160 Q145,155 245,150' },
  { name: '重慶北路 / 中山北路', d: 'M130,25 L135,115 L140,230' },
  { name: '板南聯外橋樑', d: 'M50,200 L95,165' },
  { name: '永和中正橋', d: 'M135,180 L130,225' }
];

interface RiderHotspotMapProps {
  onReserveDistrict?: (districtName: string) => void;
}

export default function RiderHotspotMap({ onReserveDistrict }: RiderHotspotMapProps) {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('daan');
  const [timePeriodIndex, setTimePeriodIndex] = useState<number>(1); // default Lunch Peak
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'ubereats' | 'foodpanda'>('all');
  const [heatThreshold, setHeatThreshold] = useState<number>(1.0);
  const [mapLayer, setMapLayer] = useState<'heat' | 'beacons'>('heat');
  const [riderBeacons, setRiderBeacons] = useState<Array<{ id: number; x: number; y: number; platform: 'ubereats' | 'foodpanda'; angle: number; speed: number }>>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentDistrict = DISTRICTS_DATA[selectedDistrictId];
  const currentTime = TIME_PERIODS[timePeriodIndex];

  // Auto-play interval for peak cycle
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimePeriodIndex((prev) => (prev + 1) % TIME_PERIODS.length);
      }, 4000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Generate and animate moving riders (simulating real GPS feeds)
  useEffect(() => {
    // Initial beacons
    const initialBeacons = Array.from({ length: 28 }).map((_, i) => {
      // Pick a random district to place the rider near its center
      const keys = Object.keys(DISTRICTS_DATA);
      const randKey = keys[i % keys.length];
      const dist = DISTRICTS_DATA[randKey];
      return {
        id: i,
        x: dist.center.x + (Math.random() * 24 - 12),
        y: dist.center.y + (Math.random() * 24 - 12),
        platform: Math.random() > 0.5 ? 'ubereats' : ('foodpanda' as any),
        angle: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 1.5
      };
    });
    setRiderBeacons(initialBeacons);

    // Animation loop to simulate movement
    const moveInterval = setInterval(() => {
      setRiderBeacons((prev) => 
        prev.map((beacon) => {
          // Add a small drunkards walk to simulate delivery routes, bounding within map box
          let newAngle = beacon.angle + (Math.random() * 0.8 - 0.4);
          let dx = Math.cos(newAngle) * beacon.speed;
          let dy = Math.sin(newAngle) * beacon.speed;
          
          let newX = beacon.x + dx;
          let newY = beacon.y + dy;

          // Boundary bounce
          if (newX < 20 || newX > 280) {
            newAngle = Math.PI - newAngle;
            newX = Math.max(20, Math.min(280, newX));
          }
          if (newY < 25 || newY > 260) {
            newAngle = -newAngle;
            newY = Math.max(25, Math.min(260, newY));
          }

          return {
            ...beacon,
            x: newX,
            y: newY,
            angle: newAngle
          };
        })
      );
    }, 150);

    return () => clearInterval(moveInterval);
  }, []);

  // Filter riders based on platform selector
  const filteredBeacons = riderBeacons.filter(b => {
    if (platformFilter === 'all') return true;
    return b.platform === platformFilter;
  });

  // Calculate dynamic stats
  const dynamicRiders = Math.round(currentDistrict.baseRiders * currentTime.multiplier * (platformFilter === 'all' ? 1.0 : 0.55));
  const dynamicImpressions = Math.round(currentDistrict.baseImpressions * currentTime.multiplier * heatThreshold);

  return (
    <div className="w-full bg-[#111111] border-4 border-[#111111] rounded-none p-4 sm:p-8 text-[#E2E8F0] relative overflow-hidden brutalist-shadow-lg-yellow my-12">
      
      {/* Background Tech Grid Deco */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none" />

      {/* Header and Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b-2 border-slate-800 pb-6 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FFD600] border border-[#111111] text-[#111111] text-[10px] font-black uppercase tracking-wider">
              REAL-TIME INSIGHTS
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#FFD600] font-black font-mono">
              <span className="w-1.5 h-1.5 bg-[#FFD600] animate-ping rounded-full inline-block" />
              穿巷數據引擎連線中
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <Compass className="w-7 h-7 text-[#FFD600] stroke-[2.5]" />
            <span>雙北地區 ‧ 騎士活躍熱點分佈</span>
          </h3>
          <p className="text-slate-400 text-xs font-bold">
            利用歷史與實時配送 GPS 地理數據，模擬高曝光潛力商圈，讓品牌預算精準落在含金量最高的人流節點。
          </p>
        </div>

        {/* Map Layer Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-[#1A1A1A] p-1.5 border-2 border-slate-700">
          <button
            onClick={() => setMapLayer('heat')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all rounded-none flex items-center gap-1 ${
              mapLayer === 'heat' 
                ? 'bg-[#FFD600] text-[#111111]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>熱度圖 (Heatmap)</span>
          </button>
          <button
            onClick={() => setMapLayer('beacons')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all rounded-none flex items-center gap-1 ${
              mapLayer === 'beacons' 
                ? 'bg-[#FFD600] text-[#111111]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>騎士即時座標 (GPS)</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* LEFT COLUMN: THE INTERACTIVE VECTOR MAP GRAPHIC (7 Cols) */}
        <div className="lg:col-span-7 bg-[#161616] border-4 border-[#111111] p-4 flex flex-col justify-between relative brutalist-shadow">
          
          {/* Compass Rose & Info Overlays */}
          <div className="absolute top-4 left-4 pointer-events-none z-10 bg-black/40 p-2 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
            <p>GRID: METRO TAIPEI (雙北)</p>
            <p>CENTER: DAAN 行政中心</p>
            <p>COORD SYSTEM: EPSG:3826</p>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/60 p-2.5 border border-slate-800 rounded-none z-10 space-y-1">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">圖例說明</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
              <span className="w-2.5 h-2.5 bg-[#FFD600] rounded-none opacity-80" />
              <span>選中區域 (Selected)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
              <span className="w-2.5 h-2.5 bg-[#FF5A00] rounded-full animate-ping shrink-0" />
              <span>活躍外送熱點 (Hotspot)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full inline-block bg-emerald-400" />
              <span>UberEats 騎士</span>
              <span className="w-2 h-2 rounded-full inline-block bg-pink-500" />
              <span>Foodpanda 騎士</span>
            </div>
          </div>

          {/* Interactive SVG Map Container */}
          <div className="flex-1 flex items-center justify-center min-h-[340px] relative">
            <svg 
              className="w-full max-w-[420px] aspect-[320/300]" 
              viewBox="0 0 280 270" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Draw Major Road Arteries */}
              <g stroke="#333333" strokeWidth="2.5" strokeDasharray="3,3" opacity="0.4">
                {ROAD_ARTERIES.map((road, idx) => (
                  <path key={idx} d={road.d} />
                ))}
              </g>

              {/* District Polygons */}
              <g className="cursor-pointer">
                {Object.values(DISTRICTS_DATA).map((dist) => {
                  const isSelected = selectedDistrictId === dist.id;
                  const isActivePeakZone = currentTime.activeZoneId === dist.id;

                  return (
                    <polygon
                      key={dist.id}
                      points={dist.points}
                      onClick={() => setSelectedDistrictId(dist.id)}
                      className="transition-all duration-300 outline-none"
                      fill={isSelected ? '#FFD600' : (isActivePeakZone ? '#FF5A00' : '#1F1F1F')}
                      fillOpacity={isSelected ? 0.35 : (isActivePeakZone ? 0.25 : 0.75)}
                      stroke={isSelected ? '#FFD600' : '#444444'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                  );
                })}
              </g>

              {/* Heatmap overlay markers (Shown in 'heat' mode) */}
              {mapLayer === 'heat' && (
                <g className="pointer-events-none">
                  {Object.values(DISTRICTS_DATA).map((dist) => {
                    const isSelected = selectedDistrictId === dist.id;
                    const isActivePeakZone = currentTime.activeZoneId === dist.id;
                    
                    // Heat radius and density based on timePeriod multiplier and custom slider
                    const intensity = (isSelected ? 1.4 : (isActivePeakZone ? 1.6 : 0.8)) * currentTime.multiplier * heatThreshold;
                    const rBase = isSelected ? 12 : 8;
                    const rFinal = Math.max(4, rBase * intensity);

                    return (
                      <g key={`heat-${dist.id}`}>
                        {/* Concentric heat ripples */}
                        <circle
                          cx={dist.center.x}
                          cy={dist.center.y}
                          r={rFinal * 2.5}
                          fill="#FF5A00"
                          fillOpacity={0.06 * intensity}
                        />
                        <circle
                          cx={dist.center.x}
                          cy={dist.center.y}
                          r={rFinal * 1.6}
                          fill="#FFD600"
                          fillOpacity={0.12 * intensity}
                        />
                        <circle
                          cx={dist.center.x}
                          cy={dist.center.y}
                          r={rFinal}
                          fill="#EF4444"
                          fillOpacity={0.45}
                        />
                        {/* Core pulsing hot point */}
                        <circle
                          cx={dist.center.x}
                          cy={dist.center.y}
                          r={3.5}
                          fill="#FFFFFF"
                        />
                        <circle
                          cx={dist.center.x}
                          cy={dist.center.y}
                          r={6}
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          className="animate-ping"
                          style={{ animationDuration: `${2.5 / intensity}s` }}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* GPS Beacons (Riders moving on map) */}
              {mapLayer === 'beacons' && (
                <g className="pointer-events-none">
                  {filteredBeacons.map((beacon) => (
                    <g key={beacon.id}>
                      {/* Rider dot color depends on platform */}
                      <circle
                        cx={beacon.x}
                        cy={beacon.y}
                        r={3}
                        fill={beacon.platform === 'ubereats' ? '#34D399' : '#EC4899'}
                      />
                      {/* Ambient ping of active location */}
                      <circle
                        cx={beacon.x}
                        cy={beacon.y}
                        r={6}
                        fill="none"
                        stroke={beacon.platform === 'ubereats' ? '#34D399' : '#EC4899'}
                        strokeWidth="1"
                        className="animate-pulse"
                      />
                    </g>
                  ))}
                </g>
              )}

              {/* Selected District Label Marker */}
              {currentDistrict && (
                <g pointerEvents="none">
                  <rect
                    x={currentDistrict.center.x - 42}
                    y={currentDistrict.center.y - 28}
                    width="84"
                    height="16"
                    fill="#111111"
                    stroke="#FFD600"
                    strokeWidth="1.5"
                  />
                  <text
                    x={currentDistrict.center.x}
                    y={currentDistrict.center.y - 17}
                    fill="#FFD600"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {currentDistrict.name}
                  </text>
                  <line 
                    x1={currentDistrict.center.x} 
                    y1={currentDistrict.center.y - 12} 
                    x2={currentDistrict.center.x} 
                    y2={currentDistrict.center.y} 
                    stroke="#FFD600" 
                    strokeWidth="1.5" 
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Time Slider & Player Control Container */}
          <div className="border-t-2 border-slate-800 pt-4 mt-4 space-y-4">
            
            {/* Dynamic time feedback text */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#FFD600] font-black text-sm bg-black/50 border border-slate-700 px-2 py-0.5 font-mono">
                  {currentTime.timeRange}
                </span>
                <span className="text-white text-sm font-black uppercase tracking-wider">
                  {currentTime.label}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-semibold max-w-sm">
                💡 <span className="text-[#FFD600] font-black">特徵：</span>{currentTime.description}
              </p>
            </div>

            {/* Slider Timeline Scale */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-[#1F1F1F] px-4 py-2.5 border-2 border-slate-800">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 bg-[#FFD600] text-[#111111] hover:bg-white border border-[#111111] transition-colors rounded-none"
                    title={isPlaying ? '暫停循環' : '播放循環'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-[#111111]" /> : <Play className="w-3.5 h-3.5 fill-[#111111]" />}
                  </button>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {isPlaying ? 'PEAK CYCLE AUTO-PLAYING' : 'MANUAL TIME SELECT'}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    setTimePeriodIndex(1); // Back to lunch
                    setIsPlaying(false);
                  }}
                  className="text-[10px] text-[#FFD600] hover:underline font-black flex items-center gap-1 uppercase"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>重置為中午極峰</span>
                </button>
              </div>

              {/* Chronological Blocks */}
              <div className="grid grid-cols-5 gap-1.5">
                {TIME_PERIODS.map((period, index) => {
                  const isCurrent = timePeriodIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setTimePeriodIndex(index);
                        setIsPlaying(false);
                      }}
                      className={`py-2 px-1 text-[10px] font-black text-center transition-all rounded-none border-2 ${
                        isCurrent 
                          ? 'bg-[#FFD600] text-[#111111] border-[#111111] brutalist-shadow-sm' 
                          : 'bg-[#181818] text-slate-400 border-transparent hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate">{period.label}</div>
                      <div className="text-[8px] opacity-75 font-mono tracking-tight mt-0.5">{period.timeRange.split(' ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED METRICS PANEL FOR SELECTED REGION (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Main Info Card */}
          <div className="bg-[#FFFDF0] border-4 border-[#111111] p-6 text-[#111111] brutalist-shadow-lg-yellow flex-1 flex flex-col justify-between">
            
            <div className="space-y-5">
              
              {/* Header card */}
              <div className="flex items-center justify-between border-b-2 border-[#111111] pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    {currentDistrict.engName}
                  </span>
                  <h4 className="text-2xl font-black tracking-tight text-[#111111]">
                    {currentDistrict.name}
                  </h4>
                </div>
                <div className="w-10 h-10 border-2 border-[#111111] bg-[#FFD600] text-[#111111] flex items-center justify-center font-black">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {/* Dynamic Exposure Counters */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-white border-2 border-[#111111] p-3.5 brutalist-shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                    <Users className="w-4 h-4 text-rose-500" />
                    <span>即時上線騎士</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-black text-[#111111]">
                      {dynamicRiders}
                    </span>
                    <span className="text-xs font-black">位夥伴</span>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#111111] p-3.5 brutalist-shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>月預估廣告曝光</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-mono font-black text-[#111111]">
                      {(dynamicImpressions / 10000).toFixed(0)}
                    </span>
                    <span className="text-xs font-black">萬+ CPM</span>
                  </div>
                </div>

              </div>

              {/* Segmented ROI Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-[#111111]">
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-[#FF5A00]" />
                    <span>本區綜合曝光潛力指數</span>
                  </span>
                  <span className="font-mono text-sm bg-[#FFD600] px-1.5 py-0.5 border border-[#111111]">
                    {currentDistrict.roiScore}/100 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-4 border-2 border-[#111111] rounded-none overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF5A00] to-[#FFD600] transition-all duration-500 border-r-2 border-[#111111]"
                    style={{ width: `${currentDistrict.roiScore}%` }}
                  />
                </div>
              </div>

              {/* List bullet parameters */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                
                <div className="bg-white border border-[#111111] p-3 space-y-1">
                  <div className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#FFD600] border border-[#111111] inline-block" />
                    本行政區核心熱點商圈
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentDistrict.hotspots.map((h, i) => (
                      <span key={i} className="bg-slate-100 text-[#111111] border border-slate-300 px-2 py-0.5 font-bold text-xs">
                        📍 {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#111111] p-3 space-y-1">
                  <div className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#111111]" />
                    高轉化率黃金外送時段
                  </div>
                  <p className="text-slate-600 font-bold font-mono pl-5">{currentDistrict.peakTimes}</p>
                </div>

                <div className="bg-white border border-[#111111] p-3 space-y-1">
                  <div className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#111111]" />
                    最常外送餐點品類
                  </div>
                  <div className="flex gap-2 pl-5 font-bold text-slate-600 text-xs">
                    {currentDistrict.mainCategories.join(' ‧ ')}
                  </div>
                </div>

              </div>

              {/* Region Editorial Blurb */}
              <p className="text-xs text-slate-600 leading-relaxed font-bold border-l-4 border-[#111111] pl-3 py-1">
                {currentDistrict.description}
              </p>

            </div>

            {/* Quick Action reservation button with district value injected */}
            <div className="pt-6 border-t-2 border-[#111111] mt-6">
              <button
                onClick={() => {
                  if (onReserveDistrict) {
                    onReserveDistrict(currentDistrict.name);
                  }
                }}
                className="w-full py-3.5 bg-[#111111] text-[#FFD600] font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-all border-2 border-[#111111] brutalist-shadow text-center flex items-center justify-center gap-1.5 group"
              >
                <span>預約「{currentDistrict.name}」精華檔期</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Secondary Control filters (Bento grid style) */}
          <div className="bg-[#1A1A1A] border-4 border-[#111111] p-5 text-white space-y-4 brutalist-shadow">
            <div className="text-xs font-black uppercase tracking-wider text-[#FFD600] flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              <span>實時計劃參數調整</span>
            </div>

            {/* Platform Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. 外送平台篩選</label>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'ubereats', 'foodpanda'] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setPlatformFilter(plat)}
                    className={`py-1.5 text-xs font-black text-center border transition-all ${
                      platformFilter === plat 
                        ? 'bg-[#FFD600] text-[#111111] border-[#FFD600]' 
                        : 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {plat === 'all' && '全部車隊'}
                    {plat === 'ubereats' && 'UberEats'}
                    {plat === 'foodpanda' && 'Foodpanda'}
                  </button>
                ))}
              </div>
            </div>

            {/* Heat density slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <span>2. 投放覆蓋比率 (廣告預算)</span>
                <span className="text-[#FFD600] font-mono">
                  {Math.round(heatThreshold * 100)}% 飽和度
                </span>
              </div>
              <input 
                type="range"
                min="0.4"
                max="1.5"
                step="0.1"
                value={heatThreshold}
                onChange={(e) => setHeatThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 appearance-none cursor-pointer accent-[#FFD600] border border-slate-700"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase">
                <span>低預算 (少於30台)</span>
                <span>全面覆蓋 (100台以上)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
