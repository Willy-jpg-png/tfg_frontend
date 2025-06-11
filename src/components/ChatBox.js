import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function ChatBox({ orderId, sender, onNewMessage }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const stompRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat-${orderId}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, [orderId]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/tfg/api/ws-location");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/chat/${orderId}`, (msg) => {
                    const chatMessage = JSON.parse(msg.body);
                    setMessages((prev) => {
                        const updated = [...prev, chatMessage];
                        localStorage.setItem(`chat-${orderId}`, JSON.stringify(updated));
                        return updated;
                    });
                    if (chatMessage.sender !== sender) {
                        onNewMessage?.(orderId);
                    }
                });
            },
        });

        client.activate();
        stompRef.current = client;

        return () => {
            if (stompRef.current) stompRef.current.deactivate();
        };
    }, [orderId, sender, onNewMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;

        const chatMessage = {
            orderId,
            sender,
            message: input.trim(),
            timestamp: new Date().toLocaleTimeString(),
        };

        stompRef.current?.publish({
            destination: "/app/chat/send",
            body: JSON.stringify(chatMessage),
        });

        setInput("");
    };

    return (
        <div className="mt-4 border-t pt-2 flex flex-col h-full">

            <div className="flex-1 max-h-[350px] overflow-y-auto border rounded p-3 bg-gray-100 space-y-2 text-sm">
                {messages.map((msg, idx) => {
                    const isMine = msg.sender === sender;
                    return (
                        <div
                            key={idx}
                            className={`flex transition-all duration-200 ease-in-out ${
                                isMine ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-lg shadow-md ${
                                    isMine
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-white text-black border rounded-bl-none"
                                }`}
                            >
                                <div className="text-xs font-semibold mb-1">
                                    {isMine ? "Tú" : msg.sender}
                                </div>
                                <div className="whitespace-pre-wrap break-words">{msg.message}</div>
                                <div
                                    className={`text-[10px] mt-1 text-right ${
                                        isMine ? "text-white/60" : "text-gray-500"
                                    }`}
                                >
                                    {msg.timestamp}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 mt-3">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (input.trim()) {
                                handleSend();
                            }
                        }
                    }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    rows={2}
                />

                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}
