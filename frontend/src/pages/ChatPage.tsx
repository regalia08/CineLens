import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

type ChatMessage = {
    role: 'user' | 'assistant';
    text: string;
};

function ChatPage() {
    const [strLog, setStrLog] = useState<ChatMessage[]>([]);
    const [strChat, setStrChat] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const chatTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrChat(event.target.value);
        //console.log(event.target.value);
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
            {strLog.map((chat, index) => {
                return (
                    <div key={index}>
                        <strong>{chat.role === 'user' ? '나' : 'AI'}:</strong> {chat.text}
                    </div>
                );
            })}
            <input
                className="chat"
                type="text"
                value={strChat}
                onChange={chatTxt}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />

        </div>

    );
}



export default ChatPage;