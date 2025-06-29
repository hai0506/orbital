import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Listing from '../components/Listing';
// JSON mock data
// import fundraisers from '../data/Fundraisers'; // comment this out

const Fundraisers = () => {
  //const [fundraisers, setFundraisers] = useState([]); // uncomment this
  //const [loading, setLoading] = useState(true); // this as well
  const role = localStorage.getItem("ROLE");

  // uncomment this section to test job creation
  /*
  useEffect(() => {
    async function fetchListings() {
      try {
        if (role === 'vendor') {
          const fundraisersRes = await api.get('core/fundraisers/');
          setFundraisers(fundraisersRes.data);
          fundraisers.map(fundraiser => console.log(fundraiser));
        }
      } catch (error) {
        console.error('Failed to load fundraisers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);
  */

  return (
    <>
        <Layout heading="Fundraisers">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
                {role === "vendor" && (
                    <div>hello vendor</div>
                )}
                {role === "organization" && (
                    <div>hello organization</div>
                )}
            </div>
        </Layout>
    </>
  );
};

export default Fundraisers;