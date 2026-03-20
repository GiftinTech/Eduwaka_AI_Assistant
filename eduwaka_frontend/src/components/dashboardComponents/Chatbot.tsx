/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';
import { PageHeader } from './DashboardComponents';

interface MessagePart {
  text: string;
}
interface Message {
  role: 'user' | 'model';
  parts: MessagePart[];
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;
  const getAuthToken = () => localStorage.getItem('access_token');

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const authToken = getAuthToken();
      if (!authToken) {
        setMessages([
          {
            role: 'model',
            parts: [{ text: 'Please log in to use the chatbot.' }],
          },
        ]);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${DJANGO_API_BASE_URL}ai/chat_history/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.ok) setMessages(await res.json());
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };
    if (!hasLoaded) fetchHistory();
  }, [hasLoaded, DJANGO_API_BASE_URL]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const authToken = getAuthToken();
    if (!authToken) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [{ text: 'Please log in to use the chatbot.' }],
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${DJANGO_API_BASE_URL}ai/chatbot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ chat_history: newMessages }),
      });
      if (!res.ok) throw new Error((await res.json()).detail);
      const result = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: result.bot_reply }] },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'model',
          parts: [{ text: err.message || 'An unexpected error occurred.' }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="EduWaka Chatbot"
        subtitle='Ask anything — "Can I study Medicine with these subjects?" or "Requirements for Computer Science at UNILAG?"'
        badge="AI"
        badgeVariant="indigo"
      />

      <div className="flex h-[65vh] flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        {/* Messages */}
        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4853ea]/10 text-2xl">
                🤖
              </div>
              <p className="text-sm text-[#9ca3af]">
                Type a message to start chatting!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-[#00252e] text-white'
                    : 'rounded-bl-sm border border-[#e5e7eb] bg-[#f9fafb] text-[#111827]'
                }`}
              >
                {msg.role === 'user' ? (
                  <p>{msg.parts.map((p) => p.text).join('')}</p>
                ) : (
                  <div className="prose prose-sm prose-p:my-1 prose-ul:my-1 max-w-none">
                    <ReactMarkdown>
                      {msg.parts.map((p) => p.text).join('')}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9ca3af]"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-[#e5e7eb] p-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 transition-all focus-within:border-[#eb4799] focus-within:ring-2 focus-within:ring-[#eb4799]/20">
            <input
              type="text"
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9ca3af] outline-none"
              placeholder="Type your question..."
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#eb4799] text-white transition-all hover:bg-[#d43589] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
