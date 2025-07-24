import React, { useEffect, useState, useRef } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Pencil, X, Check, Star, StarHalf } from "lucide-react"
import { Button } from '@headlessui/react'

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [original, setOriginal] = useState({});
    const [editMode, setEditMode] = useState({ bio: false, pfp: false });
    const [pfpPreview, setPfpPreview] = useState(null);
    const [confirmed, setConfirmed] = useState({ bio: false, pfp: false });
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
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
            if (profile.pfp instanceof File) {
                formData.append("pfp", profile.pfp);
            }
            await api.patch("core/profile/", formData);
            navigate('/');
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const showSaveButton = Object.values(confirmed).some(Boolean);
    if (!profile) return <p>Loading...</p>;

        const renderStars = (rating) => {
            return [...Array(5)].map((_, i) => {
                const starValue = i + 1;

                if (rating >= starValue) {
                return (
                    <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 stroke-yellow-600"
                    />
                );
                } else if (rating > i && rating < starValue) {
                return (
                    <StarHalf
                        key={i}
                        className="w-5 h-5 fill-yellow-400 stroke-yellow-600"
                    />
                );
                } else {
                return (
                    <Star
                        key={i}
                        className="w-5 h-5 fill-white stroke-gray-300"
                    />
                );
                }
            });
        };


    return (
        <Layout heading="Your Profile">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
                <div className="flex items-start space-x-6 mb-4 max-w-4xl">
                    <div className="relative">
                        {pfpPreview || profile.pfp 
                            ? (
                                <img
                                    src={
                                            pfpPreview ||
                                            (profile.pfp instanceof File
                                                ? URL.createObjectURL(profile.pfp)
                                                : profile.pfp)
                                        }
                                    alt="Profile"
                                    className="h-28 w-28 rounded-full object-cover border border-gray-300"
                                />
                            ) 
                            : (
                                <div className="h-28 w-28 rounded-full flex items-center justify-center bg-pink-400 text-white text-4xl font-bold border border-gray-300">
                                    {profile.username?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )
                        }

                        {!id && (
                            <>
                                <button
                                    type="button"
                                    className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {!editMode.pfp && <Pencil className="w-4 h-4 text-gray-700" />}
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
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
                                    <div className="absolute -bottom-6 right-0 flex space-x-2">
                                        <button type="button" onClick={() => confirmChange("pfp")}><Check className="w-4 h-4 text-green-600" /></button>
                                        <button type="button" onClick={() => cancelChange("pfp")}><X className="w-4 h-4 text-red-600" /></button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex flex-col justify-start mt-1">
                        <div className="text-2xl font-bold text-gray-900">{profile.username}</div>
                        <div className="flex items-center mt-1">{profile.rating_count === 0 ? "No ratings yet" : renderStars(profile.rating)}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <div className="relative flex items-center space-x-2">
                            <div className="text-sm text-gray-700 font-medium">Bio</div>
                            {(!editMode.bio && !id) && (
                                <button
                                    type="button"
                                    onClick={() => setEditMode((prev) => ({ ...prev, bio: true }))}
                                >
                                    <Pencil className="h-4 w-4 text-gray-500" />
                                </button>
                            )}
                            {(editMode.bio && !id) && (
                                <>
                                    <button type="button" onClick={() => confirmChange("bio")}>
                                        <Check className="w-4 h-4 text-green-600" />
                                    </button>
                                    <button type="button" onClick={() => cancelChange("bio")}>
                                        <X className="w-4 h-4 text-red-600" />
                                    </button>
                                </>
                            )}
                        </div>

                        {(editMode.bio && !id) ? (
                            <textarea
                                name="description"
                                rows={3}
                                value={profile.description || ""}
                                onChange={(e) =>
                                    setProfile({ ...profile, description: e.target.value })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="text-gray-900 whitespace-pre-line">
                                {profile.description || "No bio set."}
                            </div>
                        )}
                    </div>


                    {showSaveButton && (
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
                <Button>
                    hello
                </Button>
            </div>
        </Layout>
    );
};

export default Profile;
