import React, { useEffect, useState } from 'react';
import api from '../api';
import Layout from "../components/Layout";
import Fundraiser from '../components/Fundraiser';
import { Link } from 'react-router-dom';
// JSON mock data
//import fundraisers from '../data/Fundraisers'; // comment this out

const Fundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]); // uncomment this
  const [loading, setLoading] = useState(true); // this as well
  const role = localStorage.getItem("ROLE");

  // uncomment this section to test job creation
  // /*
  useEffect(() => {
    async function fetchFundraisers() {
      try {
        const fundraisersRes = await api.get('core/fundraisers/');
        setFundraisers(fundraisersRes.data);
        fundraisers.map(fundraiser => console.log(fundraiser));
      } catch (error) {
        console.error('Failed to load fundraisers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFundraisers();
  }, []);
  // */

  return (
    <>
        <Layout heading="Fundraisers">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
                {fundraisers.map((fundraiser, index) => {
                    return <Fundraiser key={fundraiser.fundraiser_id ?? `fallback-${index}`} fundraiser={fundraiser} role={role} />;
                })}
                {fundraisers.length === 0 && (
                    <div>You have no active fundraisers at this time.</div>
                )}
                {(fundraisers.length === 0 && role === "organization") && (
                    <Link to="/create" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Why don't you start one?
                    </Link>
                )}
            </div>
        </Layout>
    </>
  );
};

export default Fundraisers;