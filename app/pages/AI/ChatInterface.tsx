import React, { useState, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ChatMessage } from './types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  balance: number;
  suggestedPrompts?: string[];
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  balance,
  suggestedPrompts = [],
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (disabled) return;
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      setIsTyping(true);
      // Simulate AI response after 1 second
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="flex flex-col h-[600px] min-h-0 mb-8">
      <Card className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
        <div className="text-sm font-semibold text-white mb-4">AI Chat</div>
        
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-lg font-semibold text-white mb-2">AI Assistant</div>
              <div className="text-sm text-[#a1a1a1] mb-6">Ask me anything. Pay per call.</div>
              
              {suggestedPrompts.length > 0 && (
                <div className="w-full max-w-md">
                  <div className="text-xs text-[#a1a1a1] uppercase mb-3">Suggested prompts:</div>
                  <div className="space-y-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full text-left p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] hover:border-blue-600 text-sm text-white transition-colors"
                      >
                        • {prompt}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-[#a1a1a1] mt-4">Click a prompt or type your own</div>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-950/20 border border-blue-900/30'
                        : 'bg-[#141414] border border-[#262626]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-[#a1a1a1] ml-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-white whitespace-pre-wrap">{message.content}</div>
                    {message.codeBlock && (
                      <div className="mt-3 p-3 bg-[#0a0a0a] border border-[#262626] rounded font-mono text-xs text-white overflow-x-auto">
                        <pre>{message.codeBlock}</pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={() => navigator.clipboard.writeText(message.codeBlock || '')}
                        >
                          Copy Code
                        </Button>
                      </div>
                    )}
                    {message.cost && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Cost: {message.cost} USDC
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#141414] border border-[#262626] rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-[#262626] pt-4">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 min-h-[44px] max-h-[200px] bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#a1a1a1] resize-none outline-none focus:border-blue-600 disabled:opacity-60"
              rows={1}
              disabled={disabled}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              className="self-end"
            >
              Send
            </Button>
          </div>
          <div className="mt-2 text-xs text-[#a1a1a1]">
            {disabled ? 'This session is settled. Start a new session to continue.' : 'Each message costs 0.001 USDC'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;

