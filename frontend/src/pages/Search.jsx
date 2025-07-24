import Layout from '@/components/Layout';
import { useState, useEffect } from 'react'

const Search = () => {
    const searchUser = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProfiles() {
            setLoading(true);
            try {
                const profileRes = await api.get('core/profile/');
                setProfile(profileRes.data);
                setOriginal(profileRes.data);
                setPfpPreview(profileRes.data.pfp);
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [])

    return (
        <Layout heading="Search User">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">

            </div>
        </Layout>
    )
}

export default Search