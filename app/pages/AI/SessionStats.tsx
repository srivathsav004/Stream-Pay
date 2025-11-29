import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';
import { ChatSession } from './types';

interface SessionStatsProps {
  session: ChatSession;
  balance: number;
  onNewSession: () => void;
  onExportChat: () => void;
  onClearChat: () => void;
  onSaveConversation: () => void;
  onDeposit: () => void;
}

const SessionStats: React.FC<SessionStatsProps> = ({
  session,
  balance,
  onNewSession,
  onExportChat,
  onClearChat,
  onSaveConversation,
  onDeposit,
}) => {
  const callsRemaining = Math.floor(balance / 0.001);

  return (
    <div className="space-y-6">
      {/* Current Session */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-white mb-6">Current Session</h3>
        
        <div className="space-y-6">
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Status</div>
            <div className="text-sm font-medium text-white">🟢 Active</div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Calls This Session</div>
            <div className="text-2xl font-semibold text-white font-mono">{session.calls}</div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Cost This Session</div>
            <div className="text-2xl font-semibold text-white font-mono">{session.cost} AVAX</div>
            <div className="text-sm text-[#a1a1a1]">${(session.cost * 40).toFixed(2)} USD</div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Remaining Balance</div>
            <div className="text-2xl font-semibold text-white font-mono">{balance.toFixed(3)} AVAX</div>
            <div className="text-sm text-[#a1a1a1]">~{callsRemaining} calls left</div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={onNewSession}>
              New Session
            </Button>
            <Button variant="outline" size="sm" onClick={onExportChat}>
              Export Chat
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onClearChat}>
            Clear Chat
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={onSaveConversation}>
            Save Conversation
          </Button>
          <Button variant="primary" size="sm" className="w-full" onClick={onDeposit}>
            Deposit AVAX
          </Button>
        </div>
      </Card>

      {/* Recent Topics */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Topics</h3>
        <div className="space-y-2">
          {session.topics.length > 0 ? (
            session.topics.map((topic, index) => (
              <div key={index} className="text-sm text-[#a1a1a1]">
                • {topic}
              </div>
            ))
          ) : (
            <div className="text-sm text-[#a1a1a1]">No topics yet</div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="mt-4 w-full">
          View All Topics →
        </Button>
      </Card>
    </div>
  );
};

export default SessionStats;

