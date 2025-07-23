import React from 'react'

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const profileRes = await api.get(`core/user/profile/${id}`);
                setProfile(profileRes.data);
                console.log(profileRes.data);
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        }

        fetchProfile();
    }, []);

    return (

        <div>Profile</div>
    )
}

export default Profile