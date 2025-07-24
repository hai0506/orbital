import { useState } from 'react';
import { MessageCircle } from "lucide-react";
import { Button } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const Chat = ({chat}) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/chat", {state:{receiverId: chat.other.id}})
    }

    return (
        <div onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)} 
            className={`border border-gray-300 rounded-lg p-4 shadow-sm ${chat.received ? "bg-white" : "bg-gray-200"} max-w-md`}
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{chat.other.username}</h3>
            <dl style={{ marginTop: "10px" }} className="space-y-2">
                <div className="flex text-sm text-gray-700">
                    <MessageCircle className="mr-2" />
                    <dt className="font-medium">{chat.preview ? chat.preview : "No preview available"}</dt>
                </div>
            </dl>
            {hovered && (
                <Button 
                    onClick={handleClick} 
                    style={{ marginTop: "10px" }} 
                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                >
                    Check it out!
                </Button>
            )}
        </div>
    )
}

export default Chat