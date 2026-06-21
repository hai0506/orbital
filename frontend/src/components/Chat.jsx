import { useState } from 'react';
import { MessageCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Chat = ({ chat }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="pv-card max-w-md cursor-default"
            style={!chat.received ? { borderColor: 'rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.04)' } : {}}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="size-10 flex items-center justify-center rounded-full pv-avatar text-white font-bold text-base flex-shrink-0">
                    {chat.other.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                    <h3 className="pv-heading font-semibold text-base leading-tight">{chat.other.username}</h3>
                    {!chat.received && (
                        <span className="text-xs font-bold" style={{ color: 'var(--pv-purple)' }}>New message</span>
                    )}
                </div>
            </div>
            <div className="pv-detail-row mt-1">
                <MessageCircle size={14} />
                <span className="pv-muted truncate text-sm">{chat.preview || "No preview available"}</span>
            </div>
            {hovered && (
                <button onClick={() => navigate("/chat", { state: { receiverId: chat.other.id } })} style={{ marginTop: '12px' }} className="pv-btn">
                    Open chat
                </button>
            )}
        </div>
    );
}

export default Chat;
