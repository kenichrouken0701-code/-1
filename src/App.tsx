/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Target, 
  Phone, 
  UserCheck, 
  Zap, 
  RotateCcw, 
  Trophy,
  Smile,
  Frown,
  ChevronRight
} from 'lucide-react';

// --- Types ---
interface KPIState {
  calls: number;
  effective: number;
  dmEffective: number;
  prospectB: number;
}

interface StepItem {
  id: string;
  label: string;
  achieved: boolean;
}

interface StepSection {
  title: string;
  items: StepItem[];
}

// --- Constants ---
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzCDRL19MosHA572jiXDZ6hvjwAQMIsjAYlPWiB--su_P212DGfU4hImwpqDdbj1Q77Eg/exec";

const KPI_TARGETS = {
  calls: 270,
  effective: 70,
  dmEffective: 25,
  prospectB: 30,
};

const INITIAL_KPI: KPIState = {
  calls: 0,
  effective: 0,
  dmEffective: 0,
  prospectB: 0,
};

const INITIAL_STEPS: StepSection[] = [
  {
    title: "ステップ1-1：トークを覚える 🗣️",
    items: [
      { id: "1-1-1", label: "台本通りのトークを覚えた", achieved: false },
      { id: "1-1-2", label: "見込み作りトークを覚えた", achieved: false },
    ],
  },
  {
    title: "ステップ1-2：マインド面 ❤️",
    items: [
      { id: "1-2-m1", label: "お客様によってスタンスを変えない", achieved: false },
      { id: "1-2-m2", label: "アウトはチャンス！逃げない負けない！", achieved: false },
    ],
  },
  {
    title: "ステップ1-2：スキル面（平均率）📊",
    items: [
      { id: "1-2-s1", label: "250コール×3日間続ける", achieved: false },
      { id: "1-2-s2", label: "クール毎のリストを揃える", achieved: false },
      { id: "1-2-s3", label: "1番最初に「もしもし」言えた人が最強", achieved: false },
      { id: "1-2-s4", label: "先入観を無くしてリストを全部架電する", achieved: false },
      { id: "1-2-s5", label: "コールをしてから店舗情報を毎回見る", achieved: false },
    ],
  },
  {
    title: "ステップ1-2：スキル面（見込み）🔍",
    items: [
      { id: "1-2-v1", label: "メモの書き方を理解している", achieved: false },
      { id: "1-2-v2", label: "見込み作りの基準を把握している", achieved: false },
      { id: "1-2-v3", label: "見込みの追い方を理解している", achieved: false },
      { id: "1-2-v4", label: "見込みの捨て方を理解している", achieved: false },
      { id: "1-2-v5", label: "時節の切り方を理解している", achieved: false },
    ],
  },
  {
    title: "ステップ1-2：スキル面（5-1意識）✨",
    items: [
      { id: "1-2-51", label: "落ち着いて笑声を意識できている", achieved: false },
      { id: "1-2-52", label: "対面意識がある", achieved: false },
      { id: "1-2-53", label: "語尾上げができている", achieved: false },
      { id: "1-2-54", label: "言い切りで勝てる", achieved: false },
      { id: "1-2-55", label: "ポジティブに「ご期待ください！」", achieved: false },
      { id: "1-2-56", label: "ネガティブに「ご安心ください！」", achieved: false },
      { id: "1-2-57", label: "丁寧な言葉、「ですます」が使えている", achieved: false },
      { id: "1-2-58", label: "共感できている", achieved: false },
      { id: "1-2-59", label: "リアクションが1.5倍になっている", achieved: false },
    ],
  },
];

export default function App() {
  // --- State ---
  const [kpi, setKpi] = useState<KPIState>(INITIAL_KPI);
  const [steps, setSteps] = useState<StepSection[]>(INITIAL_STEPS);
  const [userName, setUserName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // --- Storage ---
  useEffect(() => {
    const savedKpi = localStorage.getItem('sales-check-kpi');
    const savedSteps = localStorage.getItem('sales-check-steps');
    const savedName = localStorage.getItem('sales-check-name');
    if (savedKpi) setKpi(JSON.parse(savedKpi));
    if (savedSteps) setSteps(JSON.parse(savedSteps));
    if (savedName) setUserName(savedName);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sales-check-kpi', JSON.stringify(kpi));
      localStorage.setItem('sales-check-steps', JSON.stringify(steps));
      localStorage.setItem('sales-check-name', userName);
    }
  }, [kpi, steps, userName, isLoaded]);

  // --- Calculations ---
  const stats = useMemo(() => {
    const kpiAchievements = [
      kpi.calls >= KPI_TARGETS.calls,
      kpi.effective >= KPI_TARGETS.effective,
      kpi.dmEffective >= KPI_TARGETS.dmEffective,
      kpi.prospectB >= KPI_TARGETS.prospectB,
    ].filter(Boolean).length;

    const allStepItems = steps.flatMap(s => s.items);
    const stepAchievements = allStepItems.filter(i => i.achieved).length;

    const totalItems = 4 + allStepItems.length;
    const totalAchieved = kpiAchievements + stepAchievements;
    const rate = Math.round((totalAchieved / totalItems) * 100);

    const unachievedList: string[] = [];
    if (kpi.calls < KPI_TARGETS.calls) unachievedList.push(`コール数 (目標: ${KPI_TARGETS.calls})`);
    if (kpi.effective < KPI_TARGETS.effective) unachievedList.push(`有効数 (目標: ${KPI_TARGETS.effective})`);
    if (kpi.dmEffective < KPI_TARGETS.dmEffective) unachievedList.push(`決済者有効数 (目標: ${KPI_TARGETS.dmEffective})`);
    if (kpi.prospectB < KPI_TARGETS.prospectB) unachievedList.push(`見込みB (目標: ${KPI_TARGETS.prospectB})`);
    
    allStepItems.forEach(item => {
      if (!item.achieved) unachievedList.push(item.label);
    });

    let message = "ここから巻き返そう！💪";
    if (rate === 100) {
      message = "完全達成！最高！🎉";
    } else if (rate >= 80) {
      message = "いい感じ！このまま突破！🔥";
    } else if (rate >= 50) {
      message = "半分クリア！もっといけるよ！✨";
    }

    return { rate, totalAchieved, totalItems, message, unachievedList };
  }, [kpi, steps]);

  // --- Handlers ---
  const handleKpiChange = (field: keyof KPIState, value: string) => {
    const numValue = parseInt(value) || 0;
    setKpi(prev => ({ ...prev, [field]: numValue }));
  };

  const toggleStep = (sectionIndex: number, itemIndex: number) => {
    const newSteps = [...steps];
    newSteps[sectionIndex].items[itemIndex].achieved = !newSteps[sectionIndex].items[itemIndex].achieved;
    setSteps(newSteps);
  };

  const handleReset = () => {
    if (window.confirm("全ての入力をリセットしてもよろしいですか？🌸")) {
      setKpi(INITIAL_KPI);
      setSteps(INITIAL_STEPS);
      setUserName("");
      localStorage.removeItem('sales-check-kpi');
      localStorage.removeItem('sales-check-steps');
      localStorage.removeItem('sales-check-name');
    }
  };

  const handleSaveToSheets = async () => {
    if (!userName.trim()) {
      alert("名前を入力してください🌸");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    try {
      const payload = {
        name: userName,
        callCount: kpi.calls,
        validCount: kpi.effective,
        decisionMakerCount: kpi.dmEffective,
        prospectB: kpi.prospectB,
        achievementRate: `${stats.rate}%`,
        completedCount: stats.totalAchieved,
        totalCount: stats.totalItems,
        incompleteItems: stats.unachievedList.join(", "),
        // 詳細なステップ進捗
        step11: steps[0].items.map(i => `${i.label}:${i.achieved ? '○' : '×'}`).join("\n"),
        mind: steps[1].items.map(i => `${i.label}:${i.achieved ? '○' : '×'}`).join("\n"),
        skill: steps.slice(2).flatMap(s => s.items).map(i => `${i.label}:${i.achieved ? '○' : '×'}`).join("\n"),
      };

      await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      });
      
      setSaveMessage("スプシに保存しました！🎉");
    } catch (error) {
      console.error(error);
      setSaveMessage("保存に失敗しました。GASのURLやデプロイ設定を確認してください。");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-pink-100 selection:text-pink-600 bg-[#FFF9FB]">
      {/* --- Header & Progress --- */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-pink-100 px-4 py-4 md:py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0">
                🌸
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-black text-pink-600 tracking-tight">
                  今日の基準達成チェック
                </h1>
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                  Sales Performance Tracker
                </p>
              </div>
            </div>

            {/* --- Name Input Area --- */}
            <div className="flex items-center gap-2 bg-pink-50/50 p-2 rounded-2xl border border-pink-100">
              <span className="text-xs font-bold text-pink-500 pl-2">名前:</span>
              <input 
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="お名前を入力"
                className="flex-1 bg-white px-3 py-1 rounded-xl border border-pink-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center justify-between md:justify-end gap-4">
               <div className="flex items-center gap-3">
                <span className={`text-xs md:text-sm font-black px-4 py-1 rounded-full border-2 bg-white animate-pulse whitespace-nowrap ${
                  stats.rate >= 80 ? 'text-orange-500 border-orange-200 bg-orange-50' : 
                  stats.rate >= 50 ? 'text-blue-500 border-blue-200 bg-blue-50' : 
                  'text-pink-500 border-pink-200 bg-pink-50'
                }`}>
                  {stats.message}
                </span>
                <div className="text-right">
                  <div className="text-3xl font-black text-pink-500 leading-none">{stats.rate}%</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">TOTAL PROGRESS</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-80 h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-pink-400 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${stats.rate}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- KPI Section --- */}
          <section className="flex flex-col gap-4">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border-2 border-pink-100 flex-1">
              <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 px-2 py-1 rounded-lg text-pink-600 text-xs font-black tracking-widest">01</span> KPI Achievement
              </h2>
              
              <div className="space-y-4">
                <KPICard 
                  label="コール数" 
                  value={kpi.calls}
                  target={KPI_TARGETS.calls}
                  onChange={(v) => handleKpiChange('calls', v)}
                />
                <KPICard 
                  label="有効数" 
                  value={kpi.effective}
                  target={KPI_TARGETS.effective}
                  onChange={(v) => handleKpiChange('effective', v)}
                />
                <KPICard 
                  label="決済者有効数" 
                  value={kpi.dmEffective}
                  target={KPI_TARGETS.dmEffective}
                  onChange={(v) => handleKpiChange('dmEffective', v)}
                />
                <KPICard 
                  label="見込みB" 
                  value={kpi.prospectB}
                  target={KPI_TARGETS.prospectB}
                  onChange={(v) => handleKpiChange('prospectB', v)}
                />
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <h3 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-wider">Quick Summary</h3>
                <div className="flex justify-around text-center">
                  <div>
                    <div className="text-sm font-black text-gray-700">
                      {[kpi.calls >= KPI_TARGETS.calls, kpi.effective >= KPI_TARGETS.effective, kpi.dmEffective >= KPI_TARGETS.dmEffective, kpi.prospectB >= KPI_TARGETS.prospectB].filter(Boolean).length} / 4
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold">KPI</div>
                  </div>
                  <div className="border-r-2 border-gray-200"></div>
                  <div>
                    <div className="text-sm font-black text-gray-700">
                      {Math.round(([kpi.calls >= KPI_TARGETS.calls, kpi.effective >= KPI_TARGETS.effective, kpi.dmEffective >= KPI_TARGETS.dmEffective, kpi.prospectB >= KPI_TARGETS.prospectB].filter(Boolean).length / 4) * 100)}%
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold">RATE</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Steps Section 1 --- */}
          <section className="flex flex-col gap-4">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border-2 border-blue-50 flex-1 flex flex-col">
              <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 px-2 py-1 rounded-lg text-blue-600 text-xs font-black tracking-widest">02</span> Preparation
              </h2>
              
              <div className="space-y-6 flex-1">
                {steps.slice(0, 2).map((section: StepSection, sIdx: number) => (
                  <div key={section.title} className="space-y-3">
                    <h3 className={`text-[10px] font-black uppercase tracking-widest ${sIdx === 0 ? 'text-blue-500' : 'text-purple-500'}`}>
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item: StepItem, iIdx: number) => (
                        <StepButton 
                          key={item.id}
                          label={item.label}
                          achieved={item.achieved}
                          onClick={() => toggleStep(sIdx, iIdx)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- Steps Section 2 --- */}
          <section className="flex flex-col gap-4">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border-2 border-yellow-50 flex-1 flex flex-col">
              <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                <span className="bg-yellow-100 px-2 py-1 rounded-lg text-yellow-600 text-xs font-black tracking-widest">03</span> Skill Checks
              </h2>
              
              <div className="space-y-4 mb-8 flex-1">
                {steps.slice(2).map((section: StepSection, sIdx: number) => (
                  <div key={section.title} className="space-y-1">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                      {section.title.split('：')[1] || section.title}
                    </h3>
                    <div className="space-y-1.5 pt-1">
                      {section.items.map((item: StepItem, iIdx: number) => (
                        <StepButton 
                          key={item.id}
                          label={item.label}
                          achieved={item.achieved}
                          onClick={() => toggleStep(sIdx + 2, iIdx)}
                          mini
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSaveToSheets}
                disabled={isSaving}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white font-black py-4 rounded-[2rem] shadow-lg transition-transform active:scale-95 text-lg"
              >
                {isSaving ? "送信中..." : "スプシに保存 ✨"}
              </button>
              {saveMessage && (
                <div className={`mt-2 text-center text-xs font-bold ${saveMessage.includes('失敗') ? 'text-red-500' : 'text-green-500'}`}>
                  {saveMessage}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* --- Footer Status --- */}
        <div className="mt-8 flex flex-col md:flex-row gap-6">
           <div className="flex-1 bg-white border-2 border-gray-100 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ACHIEVED</span>
                <span className="text-xl font-black text-gray-700">{stats.totalAchieved} / {stats.totalItems} 項目</span>
              </div>
              <div className="flex flex-col border-l-2 border-gray-100 pl-8">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">UNFINISHED</span>
                <span className={`text-xl font-black ${stats.totalItems - stats.totalAchieved === 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {stats.totalItems - stats.totalAchieved} 項目
                </span>
              </div>
            </div>

            <div className="flex-1 w-full md:max-w-xs">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-2">Notice</h3>
              <div className="flex flex-wrap gap-2">
                {stats.unachievedList.length === 0 ? (
                  <span className="bg-green-50 text-green-500 text-[10px] px-3 py-1.5 rounded-full font-bold border border-green-100">
                    Perfect Achievement! 🎉
                  </span>
                ) : (
                  <span className="bg-pink-50 text-pink-500 text-[10px] px-3 py-1.5 rounded-full font-bold border border-pink-100">
                    Keep going! You can do it! ✨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* --- Reset Area at Bottom --- */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 text-xs font-black text-gray-300 hover:text-red-400 px-8 py-3 rounded-2xl border border-gray-100 hover:border-red-100 transition-all opacity-60 hover:opacity-100"
          >
            🔄 データを全てリセットする
          </button>
        </div>
      </main>

      <footer className="mt-8 mb-12 text-center">
        <p className="text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">
          Copyright © {new Date().getFullYear()} Sales Achievement Board
        </p>
      </footer>
    </div>
  );
}

// --- Sub-components ---

function KPICard({ label, value, target, onChange }: { label: string; value: number; target: number; onChange: (v: string) => void }) {
  const isAchieved = value >= target;
  
  return (
    <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
      isAchieved ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
    }`}>
      <div className={`text-[10px] font-black mb-1 uppercase tracking-tighter ${isAchieved ? 'text-green-600' : 'text-red-600'}`}>
        {label} (目標: {target})
      </div>
      <div className="flex items-center justify-between gap-3">
        <input 
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={`w-24 px-3 py-1.5 text-2xl font-black bg-white rounded-xl border-2 border-transparent focus:outline-none focus:border-pink-200 shadow-inner ${
            isAchieved ? 'text-green-700' : 'text-red-700'
          }`}
        />
        <div className={`text-[10px] font-black px-4 py-2 rounded-full text-white shadow-sm transition-transform active:scale-95 ${
          isAchieved ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isAchieved ? '○ 達成' : '× 未達成'}
        </div>
      </div>
    </div>
  );
}

function StepButton({ label, achieved, onClick, mini = false }: { label: string; achieved: boolean; onClick: () => void; mini?: boolean; key?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 border-2 rounded-2xl transition-all text-left shadow-sm hover:shadow-md ${
        mini ? 'p-2' : 'p-3'
      } ${
        achieved 
          ? 'bg-green-50 border-green-200 text-green-700' 
          : 'bg-white border-gray-100 text-gray-400'
      }`}
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
        achieved ? 'bg-green-500 border-green-400 shadow-sm' : 'bg-white border-gray-100'
      }`}>
        {achieved ? (
          <span className="text-white text-[10px] font-bold">✓</span>
        ) : (
          <span className="text-gray-100 text-[10px] font-bold">×</span>
        )}
      </div>
      <span className={`font-bold leading-none ${mini ? 'text-[11px]' : 'text-sm text-balance'}`}>
        {label}
      </span>
    </motion.button>
  );
}
