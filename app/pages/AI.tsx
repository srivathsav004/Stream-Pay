import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { ChatMessage } from './AI/types';
import AIHeader from './AI/AIHeader';
import PricingBanner from './AI/PricingBanner';
import AIStats from './AI/AIStats';
import ChatInterface from './AI/ChatInterface';
import SessionStats from './AI/SessionStats';
import UsageHistory from './AI/UsageHistory';
import Analytics from './AI/Analytics';
import { useAccount } from 'wagmi';
import { getStats, getHistory, getCost } from '@/app/shared/services/web2-services/ai';

const AI: React.FC = () => {
  const { address } = useAccount();
  const [balance] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState({
    id: 'session-1',
    sessionNumber: 1,
    startTime: new Date().toLocaleString(),
    calls: 0,
    cost: 0,
    topics: [],
    messages: [],
  });
  const [stats, setStats] = useState({ totalSpent: 0, totalCalls: 0, avgPerCall: 0, thisMonth: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [costData, setCostData] = useState<any | null>(null);
  const [settled, setSettled] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch stats/history/cost when wallet connects
  useEffect(() => {
    const init = async () => {
      if (!address) return;
      try {
        const [st, hist, cost] = await Promise.all([
          getStats(address),
          getHistory(address),
          getCost(address),
        ]);
        setStats({
          totalSpent: Number(st.totalSpent?.toFixed?.(3) ?? st.totalSpent),
          totalCalls: st.totalCalls,
          avgPerCall: Number(st.avgPerCall?.toFixed?.(4) ?? st.avgPerCall),
          thisMonth: st.thisMonth,
        });
        setHistory(hist);
        setCostData(cost);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('init session failed', e);
      }
    };
    init();
  }, [address]);

  const handleSendMessage = async (content: string) => {
    // local-only simulated chat; no backend calls
    const now = 'Just now';
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: now,
    };
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: `This is a sample response: ${content}`,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    // count this call and cost locally
    setSession((prev) => ({
      ...prev,
      calls: (prev.calls || 0) + 1,
      cost: Number(((prev.cost || 0) + 0.001).toFixed(6)),
    }));
  };

  const handleNewSession = () => {
    setMessages([]);
    setSession({
      ...session,
      sessionNumber: session.sessionNumber + 1,
      calls: 0,
      cost: 0,
      topics: [],
      messages: [],
    });
    setSettled(false);
  };

  const handleExportChat = () => {
    const chatData = {
      session: session,
      messages: messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-${session.sessionNumber}.json`;
    a.click();
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSaveConversation = () => {
    // In a real app, this would save to backend
    console.log('Saving conversation...', { session, messages });
  };

  const handleDeposit = () => {
    // In a real app, this would open deposit modal
    console.log('Opening deposit modal...');
  };

  return (
    <DashboardLayout>
      <AIHeader />
      {/* <PricingBanner balance={balance} /> */}
      <AIStats
        totalSpent={stats.totalSpent}
        totalCalls={stats.totalCalls}
        avgPerCall={stats.avgPerCall}
        thisMonth={stats.thisMonth}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 mb-8">
        <div className="xl:col-span-7">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            balance={balance}
            suggestedPrompts={[]}
            disabled={settled}
          />
        </div>
        <div className="xl:col-span-3">
          <SessionStats
            session={session}
            balance={balance}
            onNewSession={handleNewSession}
            onExportChat={handleExportChat}
            onClearChat={handleClearChat}
            onSaveConversation={handleSaveConversation}
            onDeposit={handleDeposit}
            onSettledChange={(s) => setSettled(s)}
            onAfterSettle={async () => {
              if (!address) return;
              try {
                const [st, hist, cost] = await Promise.all([
                  getStats(address),
                  getHistory(address),
                  getCost(address),
                ]);
                setStats({
                  totalSpent: Number(st.totalSpent?.toFixed?.(3) ?? st.totalSpent),
                  totalCalls: st.totalCalls,
                  avgPerCall: Number(st.avgPerCall?.toFixed?.(4) ?? st.avgPerCall),
                  thisMonth: st.thisMonth,
                });
                setHistory(hist);
                setCostData(cost);
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('refresh after settle failed', e);
              }
            }}
          />
        </div>
      </div>

      <UsageHistory history={history} />
      <Analytics
        callsData={history.map((h: any) => ({ date: String(h.date).split(',')[0], calls: h.calls }))}
        topicData={[
          { topic: 'General Questions', calls: 12 },
          { topic: 'Pricing', calls: 8 },
          { topic: 'Integrations', calls: 5 },
          { topic: 'Troubleshooting', calls: 4 },
          { topic: 'Docs', calls: 3 },
        ]}
      />
    </DashboardLayout>
  );
};

export default AI;
