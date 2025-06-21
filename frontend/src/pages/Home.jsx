import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Listing from '../components/Listing';
import listings from '../data/Listings';

const Home = () => {
  const [role, setRole] = useState(null);
  //const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileAndListings() {
      try {
        const userProfile = await api.get('core/user/profile/');
        setRole(userProfile.data.role);
        /*
        if (profileRes.data.role === 'vendor') {
          const listingsRes = await api.get('core/posts/');
          setListings(listingsRes.data);
        }
        */
      } catch (error) {
        console.error('Failed to load profile or listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndListings();
  }, []);

  return (
    <>
      <Layout method="Listings">
        {role === "vendor" && (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
            {listings.map((listing, index) => (
              <Listing key={listing.id || index} fields={listing} />
            ))}
          </div>
        )}
        {role === "organization" && (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p>Hello organization</p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Home;
