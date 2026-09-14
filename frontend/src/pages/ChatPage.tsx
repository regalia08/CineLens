import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

type ChatMessage = {
    role: 'user' | 'assistant';
    text: string;
};

function ChatPage() {
    const [strLog, setStrLog] = useState<ChatMessage[]>([]);
    const [strChat, setStrChat] = useState<string>('');

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
        if (strChat.trim() === '') return; // 빈 메시지 방지

        const userMessage: ChatMessage = { role: 'user', text: strChat };
        setStrLog((prev) => [...prev, userMessage]);
        setStrChat('');

        const result = await apiRequest('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: strChat }),
        });

        const aiMessage: ChatMessage = { role: 'assistant', text: result.reply };
        setStrLog((prev) => [...prev, aiMessage]);
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
                onChange={chatTxt}
                onKeyDown={handleKeyDown}
            />

        </div>

    );
}



export default ChatPage;