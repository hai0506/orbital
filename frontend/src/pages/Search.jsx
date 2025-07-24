import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import UserProfile from '@/components/UserProfile';
import api from '@/api';

const Search = () => {
    const [searchUser, setSearchUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [allProfiles, setAllProfiles] = useState([]);
    const [profiles, setProfiles] = useState([]);

    // /*
    useEffect(() => {
        async function fetchProfiles() {
            setLoading(true);
            try {
                const profilesRes = await api.get('core/profiles/');
                setAllProfiles(profilesRes.data);
                setProfiles(profilesRes.data);
                console.log(allProfiles);
            } catch (error) {
                console.error('Failed to load profiles:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfiles();
    }, [])
    // */

    useEffect(() => {
        const filtered = allProfiles.filter(profile =>
            profile.username.toLowerCase().includes(searchUser.toLowerCase())
        );
        setProfiles(filtered);
    }, [searchUser, allProfiles]);

    return (
        <Layout heading="Search User">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
                <Input
                    type="search"
                    placeholder="Search for Vendor or Organisation"
                    onChange={e => setSearchUser(e.target.value)}
                    className="w-full md:w-1/3 mb-4"
                />
                <div className="grid grid-cols-3 gap-4">
                    {profiles?.map(profile => (
                        <UserProfile profile={profile} />
                    ))}
                </div>  
            </div>
        </Layout>
    )
}

export default Search;