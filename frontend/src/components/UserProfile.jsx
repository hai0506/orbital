import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';

const UserProfile = ({ profile }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="pv-card max-w-md cursor-default"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="size-10 flex items-center justify-center rounded-full pv-avatar text-white font-bold text-base flex-shrink-0">
                    {profile.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <h3 className="pv-heading font-semibold text-base">{profile.username}</h3>
            </div>
            <div className="pv-detail-row">
                <CircleUserRound size={15} />
                <span className="pv-body font-medium">
                    {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ''}
                </span>
            </div>
            {hovered && (
                <button onClick={() => navigate(`/profiles/${profile.id}`)} style={{ marginTop: '12px' }} className="pv-btn">
                    Open profile
                </button>
            )}
        </div>
    );
}

export default UserProfile;
