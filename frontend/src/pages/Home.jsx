import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Listing from '../components/Listing';
// JSON mock data
import listings from '../data/Listings';

const Home = () => {
  //const [listings, setListings] = useState([]);
  //const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("ROLE");

  /*
  useEffect(() => {
    async function fetchListings() {
      try {
        if (role === 'vendor') {
          const listingsRes = await api.get('core/posts/');
          setListings(listingsRes.data);
        }
      } catch (error) {
        console.error('Failed to load profile or listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);
  */

  return (
    <>
        {role === "vendor" && (
          <Layout heading="Listings">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
              {listings.map((listing, index) => (
                <Listing key={listing.id || index} fields={listing} />
              ))}
            </div>
          </Layout>
        )}
        {role === "organization" && (
          <Layout heading="Offers">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <p>Hello organization</p>
              </div>
          </Layout>
        )}
    </>
  );
};

export default Home;
