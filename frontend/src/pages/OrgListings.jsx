import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Listing from '../components/Listing';

const OrgListings = () => {
  const [listings, setListings] = useState([]); // uncomment this
  const [loading, setLoading] = useState(true); // this as well
  const role = localStorage.getItem("ROLE");

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRes = await api.get('core/create-post/');
        setListings(listingsRes.data);
        listings.map(listing => console.log(listing));
      } catch (error) {
        console.error('Failed to load listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  return (
    <>
        <Layout heading="Listings">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            <div className="grid grid-cols-3 gap-4">
            {listings.map((listing, index) => (
                <Listing key={listing.id || index} fields={listing} role={role}/>
            ))}
            {listings.length === 0 && (
                <div>You have no job listings at the moment.</div>
            )}
            </div>
        </div>
        </Layout>
    </>
  );
};

export default OrgListings;
