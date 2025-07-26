import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Listing from '../components/Listing';
import Offers from './Offers';
// JSON mock data
// import listings from '../data/Listings'; // comment this out
import ListingFilter from '../components/ListingFilter'

const Home = () => {
  const [listings, setListings] = useState([]); // uncomment this
  const [loading, setLoading] = useState(true); // this as well
  const role = localStorage.getItem("ROLE");

  const applyFilters = async (filters) => {
    try {
        const listingsRes = await api.get(`core/posts/?${filters}`);
        setListings(listingsRes.data);
    } catch (error) {
        console.error('Filter failed:', error);
    } finally {
        setLoading(false);
    }
};

  // uncomment this section to test job creation
  // /*
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRes = await api.get('core/posts/');
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
  // */

  return (
    <>
        <Layout heading="Listings">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-4">
              <ListingFilter onApply={applyFilters} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing, index) => (
                <Listing key={listing.id || index} fields={listing} role={role} />
              ))}
              {listings.length === 0 && (
                <div>There are no listings available at this time.</div>
              )}
            </div>
          </div>
        </Layout>
    </>
  );
};

export default Home;
