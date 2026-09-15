import { useEffect, useState, useRef } from "react";
import { apiRequest } from "../utils/api";

type ChatMessage = {
    role: 'user' | 'assistant';
    text: string;
};

function ChatPage() {
    const [strLog, setStrLog] = useState<ChatMessage[]>([]);
    const [strChat, setStrChat] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [strLog]);

    // 컴포넌트 마운트 시 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('chatLog');
        if (saved) {
            setStrLog(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    // strLog 바뀔 때마다 저장 (불러오기가 끝난 뒤부터만)
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('chatLog', JSON.stringify(strLog));
    }, [strLog, isLoaded]);

    const chatTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrChat(event.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    async function sendMessage() {
        if (strChat.trim() === '') return;
        if (isLoading) return;

        setIsLoading(true);

        const userMessage: ChatMessage = { role: 'user', text: strChat };
        setStrLog((prev) => [...prev, userMessage]);
        setStrChat('');

        try {
            const result = await apiRequest('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message: strChat }),
            });
            const aiMessage: ChatMessage = { role: 'assistant', text: result.reply };
            setStrLog((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { role: 'assistant', text: '죄송해요, 오류가 발생했어요. 잠시 후 다시 시도해주세요.' };
            setStrLog((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 max-h-[70vh] min-h-[200px] bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    {strLog.map((chat, index) => (
                        <div
                            key={index}
                            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${chat.role === 'user'
                                    ? 'bg-red-600 text-white rounded-br-sm'
                                    : 'bg-zinc-800 text-white rounded-bl-sm'
                                    }`}
                            >
                                {chat.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 text-zinc-400 px-4 py-2 rounded-2xl rounded-bl-sm">
                                입력 중...
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                <input
                    className="bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 disabled:opacity-50"
                    type="text"
                    placeholder="영화에 대해 물어보세요..."
                    value={strChat}
                    onChange={chatTxt}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}

export default ChatPage;