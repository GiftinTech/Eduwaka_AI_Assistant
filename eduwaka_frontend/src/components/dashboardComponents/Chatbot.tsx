/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import ReactMarkdown from 'react-markdown';

interface MessagePart {
  text: string;
}

interface Message {
  role: 'user' | 'model';
  parts: MessagePart[];
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

  const getAuthToken = (): string | null => {
    return localStorage.getItem('access_token');
  };

  // fetch history on component mount
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
        const response = await fetch(`${DJANGO_API_BASE_URL}ai/chat_history/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const history = await response.json();
          setMessages(history);
        } else {
          console.error('Failed to fetch chat history.');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };

    if (!hasLoaded) {
      fetchHistory();
    }
  }, [hasLoaded, DJANGO_API_BASE_URL]);

  // Auto scroll whenever messages or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const authToken = getAuthToken();
    if (!authToken) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'model',
          parts: [{ text: 'Please log in to use the chatbot.' }],
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}ai/chatbot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ chat_history: newMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      const result = await response.json();
      const botResponse: string = result.bot_reply;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'model', parts: [{ text: botResponse }] },
      ]);
    } catch (error: any) {
      console.error('Error communicating with chatbot backend:', error);
      const errorMessage =
        error.message || 'An unexpected error occurred. Please try again.';

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: 'model', parts: [{ text: errorMessage }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">EduWaka Chatbot</h2>
      <p className="mb-4 text-gray-700">
        Ask me questions like "Can I study Medicine with these subjects?" or
        "What are the requirements for Computer Science at UNILAG?".
      </p>
      <div className="flex h-[63vh] flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 sm:h-96">
        <div className="custom-scrollbar mb-4 flex-1 space-y-3 overflow-y-auto p-2">
          {messages.length === 0 && (
            <div className="mt-10 text-center text-gray-500">
              Type a message to start chatting!
            </div>
          )}
          {messages.map((msg, index: number) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.role === 'user' ? (
                  <p>{msg.parts.map((part) => part.text).join('')}</p>
                ) : (
                  <ReactMarkdown>
                    {msg.parts.map((part) => part.text).join('')}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs rounded-lg bg-gray-200 p-3 text-gray-800 shadow-sm">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
          {/* 👇 Dummy div for auto-scroll */}
          <div ref={bottomRef} />
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
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
            className="rounded-r-lg bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
