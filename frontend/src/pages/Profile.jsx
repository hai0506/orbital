import React, { useEffect, useState, useRef } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Pencil, X, Check, Star, StarHalf } from "lucide-react"

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [original, setOriginal] = useState({});
    const [editMode, setEditMode] = useState({ bio: false, pfp: false });
    const [pfpPreview, setPfpPreview] = useState(null);
    const [confirmed, setConfirmed] = useState({ bio: false, pfp: false });
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const endpoint = id ? `core/profiles/${id}` : 'core/profile/';
                const profileRes = await api.get(endpoint);
                setProfile(profileRes.data);
                if (!id) {
                    setOriginal(profileRes.data);
                    setPfpPreview(profileRes.data.pfp);
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [id]);

    const confirmChange = (field) => {
        setOriginal((prev) => ({ ...prev, [field]: profile[field] }));
        setEditMode((prev) => ({ ...prev, [field]: false }));
        setConfirmed((prev) => ({ ...prev, [field]: true }));
    };

    const cancelChange = (field) => {
        setProfile((prev) => ({ ...prev, [field]: original[field] }));
        setEditMode((prev) => ({ ...prev, [field]: false }));
        setConfirmed((prev) => ({ ...prev, [field]: false }));
        if (field === "pfp") setPfpPreview(original.pfp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("description", profile.description || "");
            if (profile.pfp instanceof File) formData.append("pfp", profile.pfp);
            await api.patch("core/profile/", formData);
            navigate('/');
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const showSaveButton = Object.values(confirmed).some(Boolean);

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--pv-bg)' }}>
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(124,58,237,0.2)', borderTopColor: '#7c3aed' }} />
        </div>
    );

    const renderStars = (rating) =>
        [...Array(5)].map((_, i) => {
            const v = i + 1;
            if (rating >= v) return <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />;
            if (rating > i) return <StarHalf key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />;
            return <Star key={i} className="w-4 h-4 stroke-gray-300" style={{ fill: 'var(--pv-card-bg)' }} />;
        });

    const editIconBtn = "p-1 rounded-md transition-colors hover:opacity-70";

    return (
        <Layout heading={id ? "User Profile" : "Your Profile"}>
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

                {/* Profile hero card */}
                <div className="pv-card flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {pfpPreview || profile.pfp
                            ? (
                                <img
                                    src={pfpPreview || (profile.pfp instanceof File ? URL.createObjectURL(profile.pfp) : profile.pfp)}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover"
                                    style={{ boxShadow: '0 0 0 3px rgba(124,58,237,0.3)' }}
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full flex items-center justify-center pv-avatar text-white text-3xl font-bold"
                                    style={{ boxShadow: '0 0 0 3px rgba(124,58,237,0.3)' }}>
                                    {profile.username?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )
                        }
                        {!id && (
                            <>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 p-1.5 rounded-full shadow-md transition-opacity hover:opacity-80"
                                    style={{ background: 'var(--pv-card-bg)', border: '1px solid var(--pv-card-border)' }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Pencil size={13} style={{ color: 'var(--pv-purple)' }} />
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setProfile((prev) => ({ ...prev, pfp: file }));
                                            setPfpPreview(URL.createObjectURL(file));
                                            setEditMode((prev) => ({ ...prev, pfp: true }));
                                        }
                                    }}
                                />
                                {editMode.pfp && (
                                    <div className="absolute -bottom-7 right-0 flex gap-1">
                                        <button type="button" onClick={() => confirmChange("pfp")} className={editIconBtn}><Check size={14} className="text-green-500" /></button>
                                        <button type="button" onClick={() => cancelChange("pfp")} className={editIconBtn}><X size={14} className="text-red-500" /></button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1.5 pt-1">
                        <h2 className="pv-heading text-xl font-bold">{profile.username}</h2>
                        {profile.role && (
                            <span className="pv-badge w-fit">
                                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                            </span>
                        )}
                        <div className="flex items-center gap-0.5 mt-1">
                            {profile.rating ? renderStars(profile.rating) : (
                                <span className="pv-muted text-sm">No ratings yet</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio card */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="pv-card">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="pv-heading text-sm font-semibold">Bio</span>
                            {!id && !editMode.bio && (
                                <button type="button" onClick={() => setEditMode(p => ({ ...p, bio: true }))} className={editIconBtn}>
                                    <Pencil size={13} style={{ color: 'var(--pv-purple)' }} />
                                </button>
                            )}
                            {!id && editMode.bio && (
                                <div className="flex gap-1">
                                    <button type="button" onClick={() => confirmChange("bio")} className={editIconBtn}><Check size={13} className="text-green-500" /></button>
                                    <button type="button" onClick={() => cancelChange("bio")} className={editIconBtn}><X size={13} className="text-red-500" /></button>
                                </div>
                            )}
                        </div>
                        {editMode.bio && !id
                            ? <textarea name="description" rows={3} value={profile.description || ""}
                                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                className="pv-textarea" style={{ minHeight: '80px' }} />
                            : <p className="pv-body text-sm leading-relaxed whitespace-pre-line">
                                {profile.description || "No bio set."}
                              </p>
                        }
                    </div>

                    {showSaveButton && (
                        <button type="submit" className="pv-btn self-start">Save Changes</button>
                    )}

                    {id && (
                        <button type="button" onClick={() => navigate("/chat", { state: { receiverId: id } })} className="pv-btn self-start">
                            Contact {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ''}
                        </button>
                    )}
                </form>
            </div>
        </Layout>
    );
};

export default Profile;
