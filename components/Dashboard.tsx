

import React, { useState, useCallback, useEffect, useContext } from 'https://esm.sh/react@^18.3.1';
import { InputForm } from './InputForm.tsx';
import { ScriptDisplay } from './ScriptDisplay.tsx';
import { generateScripts, analyzeScriptVirality, enhanceTopic, generateVisualsForScript, remixScript, QUOTA_ERROR_MESSAGE } from '../services/geminiService.ts';
import type { Script, Client, Folder, User, Notification, EnhancedTopic, Trend } from '../types.ts';
import { SavedScriptsView } from './SavedScriptsView.tsx';
import { TrendingTopicsView } from './TrendingTopicsView.tsx';
import { DFYContentView, mockDfyScripts } from './DFYContentView.tsx';
import { AgencyView } from './AgencyView.tsx';
import { ResellerDashboardView } from './ResellerDashboardView.tsx';
import { AddClientModal } from './AddClientModal.tsx';
import { DashboardHomeView } from './DashboardHomeView.tsx';
import { AccountSettingsView } from './AccountSettingsView.tsx';
import { NotificationsPanel } from './NotificationsPanel.tsx';
import { PlaceholderView } from './PlaceholderView.tsx';
import { SaveScriptModal } from './SaveScriptModal.tsx';
import { EditClientModal } from './EditClientModal.tsx';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import { VideoDeconstructorView } from './VideoDeconstructorView.tsx';
import { PersonalizationModal } from './PersonalizationModal.tsx';
import { DashboardContext } from '../context/DashboardContext.tsx';
import { QuotaErrorModal } from './QuotaErrorModal.tsx';

interface DashboardProps {
    impersonatingClient: Client | null;
    onLoginAsClient: (client: Client) => void;
    onLogoutClientView: () => void;
}

interface MenuItem {
    name: string;
    icon: string;
    premium?: boolean;
    hasNew?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ impersonatingClient, onLoginAsClient, onLogoutClientView }) => {
  const { state, dispatch } = useContext(DashboardContext);
  const { user, savedScripts, folders, notifications, watchedTrends, clients, dashboardStats, movingScriptId, isLoading: isContextLoading, isNewDfyAvailable } = state;

  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [initialTopic, setInitialTopic] = useState<string | undefined>(undefined);
  const [scoringScriptId, setScoringScriptId] = useState<string | null>(null);
  const [visualizingScriptId, setVisualizingScriptId] = useState<string | null>(null);
  const [speakingScriptId, setSpeakingScriptId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [enhancedTopics, setEnhancedTopics] = useState<EnhancedTopic[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [scriptToSave, setScriptToSave] = useState<Script | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationProps, setConfirmationProps] = useState({ onConfirm: () => {}, title: '', message: '' });
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);
  
  const activeUser = impersonatingClient || user;

  useEffect(() => {
    if (user && !user.isPersonalized && !impersonatingClient) {
        setIsPersonalizationModalOpen(true);
    }
  }, [user, impersonatingClient]);
    
  // Reseller stats simulation remains client-side for now
  useEffect(() => {
    const interval = setInterval(() => {
        const newClicks = dashboardStats.clicks + Math.floor(Math.random() * 5) + 1;
        const newSales = Math.random() > 0.9 ? dashboardStats.sales + 1 : dashboardStats.sales;
        const newEarnings = newSales > dashboardStats.sales ? dashboardStats.earnings + 17 : dashboardStats.earnings;
        dispatch({ type: 'SET_DASHBOARD_STATS', payload: { clicks: newClicks, sales: newSales, earnings: newEarnings } });
    }, 8000);
    return () => clearInterval(interval);
  }, [dashboardStats, dispatch]);

  const addNotification = useCallback((message: string) => {
    dispatch({ type: 'ADD_NOTIFICATION_REQUEST', payload: { message } });
  }, [dispatch]);

  const handleCompletePersonalization = (data: { niche: string; platforms: ('tiktok' | 'instagram' | 'youtube')[]; tone: string }) => {
    dispatch({ type: 'COMPLETE_PERSONALIZATION_REQUEST', payload: data });
    setIsPersonalizationModalOpen(false);
    addNotification("Your dashboard is now personalized! Welcome to Vid Script Hub.");
  };

  const handleGenerate = useCallback(async (topic: string, tone: string, length: number) => {
    setIsLoading(true); setError(null); setEnhancedTopics([]);
    addNotification(`AI is generating scripts for "${topic}"...`);
    try {
      const newScripts = await generateScripts(topic, tone, length, user?.platforms);
      setScripts(newScripts);
      addNotification(`Successfully generated 5 scripts for "${topic}"!`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (errorMessage === QUOTA_ERROR_MESSAGE) {
        dispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage });
      } else {
        setError(errorMessage); 
        addNotification(`Error generating scripts: ${errorMessage}`); 
        setScripts([]);
      }
    } finally { setIsLoading(false); }
  }, [addNotification, user?.platforms, dispatch]);
  
  const handleEnhanceTopic = useCallback(async (topic: string) => {
    if (!topic.trim()) return; setIsEnhancing(true); setEnhancedTopics([]);
    addNotification(`Supercharging topic: "${topic}"...`);
    try {
        const suggestions = await enhanceTopic(topic);
        setEnhancedTopics(suggestions); addNotification(`Generated new angles for "${topic}"!`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "AI failed to enhance topic.";
         if (errorMessage === QUOTA_ERROR_