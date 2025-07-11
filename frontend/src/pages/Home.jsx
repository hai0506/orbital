import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Listing from '../components/Listing';
import Offers from './Offers';
// JSON mock data
//import listings from '../data/Listings'; // comment this out

const Home = () => {
  const [listings, setListings] = useState([]); // uncomment this
  const [loading, setLoading] = useState(true); // this as well
  const role = localStorage.getItem("ROLE");

  // uncomment this section to test job creation
  // /*
  useEffect(() => {
    async function fetchListings() {
      try {
        if (role === 'vendor') {
          const listingsRes = await api.get('core/posts/');
          setListings(listingsRes.data);
          listings.map(listing => console.log(listing));
        }
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
        {role === "vendor" && (
          <Layout heading="Listings">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
              {listings.map((listing, index) => (
                <Listing key={listing.id || index} fields={listing} />
              ))}
              {listings.length === 0 && (
                <div>There are no listings available at this time.</div>
              )}
            </div>
          </Layout>
        )}
        {role === "organization" && (
          <Offers />
        )}
    </>
  );
};

export default Home;
