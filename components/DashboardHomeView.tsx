

import React, { useState, useEffect, useCallback, useContext } from 'https://esm.sh/react@^18.3.1';
import type { Script, Trend } from '../types.ts';
import { fetchTrendingTopics, QUOTA_ERROR_MESSAGE } from '../services/geminiService.ts';
import { ScriptCard } from './ScriptCard.tsx';
import { TrendCard } from './TrendCard.tsx';
import { DashboardContext } from '../context/DashboardContext.tsx';

interface DashboardHomeViewProps {
    onNavigate: (view: string) => void;
    recentScripts: Script[];
    onOpenSaveModal: (script: Script) => void;
    onUnsaveScript: (scriptId: string) => void;
    isScriptSaved: (script: Script) => boolean;
    scoringScriptId: string | null;
    onGenerateForTrend: (topic: string) => void;
    addNotification: (message: string) => void;
    agencyClientCount: number;
    agencyEarnings: string;
    watchedTrends: Trend[];
    onWatchTrend: (trend: Trend) => void;
    onUnwatchTrend: (topic: string) => void;
    isTrendWatched: (topic: string) => boolean;
    onVisualize: (scriptId: string, artStyle: string) => void;
    visualizingScriptId: string | null;
    primaryNiche?: string;
    scriptOfTheDay?: Script;
    onToggleSpeech: (script: Script) => void;
    speakingScriptId: string | null;
}

const QuickActionCard: React.FC<{icon: string, title: string, description: string, onClick: () => void}> = ({icon, title, description, onClick}) => (
    <button onClick={onClick} className="bg-[#2A1A5E] p-6 rounded-xl border border-[#4A3F7A] text-left hover:border-[#DAFF00] hover:-translate-y-1 transition-all duration-300 w-full flex items-start space-x-4">
        <i className={`${icon} text-3xl text-[#DAFF00] mt-1`}></i>
        <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-purple-200/80">{description}</p>
        </div>
    </button>
);

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
    onNavigate,
    recentScripts,
    onOpenSaveModal,
    onUnsaveScript,
    isScriptSaved,
    scoringScriptId,
    onGenerateForTrend,
    addNotification,
    agencyClientCount,
    agencyEarnings,
    watchedTrends,
    onWatchTrend,
    onUnwatchTrend,
    isTrendWatched,
    onVisualize,
    visualizingScriptId,
    primaryNiche,
    scriptOfTheDay,
    onToggleSpeech,
    speakingScriptId
}) => {
    const { dispatch } = useContext(DashboardContext);
    const [trendingTopics, setTrendingTopics] = useState<Trend[]>([]);
    const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);
    const [isLoadingTrends, setIsLoadingTrends