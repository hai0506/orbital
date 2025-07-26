import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Offer from '../components/Offer'
import VendorOffer from '../components/VendorOffer'
import api from '../api'
//import offers from '../data/Offers'
import OfferFilter from '../components/OfferFilter'
import VendorOfferFilter from '../components/VendorOfferFilter'

const Offers = () => {
    const role = localStorage.getItem("ROLE");
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);

    const applyFilters = async (filters) => {
        try {
            const offersRes = await api.get(`core/offers/?${filters}`);
            setOffers(offersRes.data);
        } catch (error) {
            console.error('Filter failed:', error);
        } finally {
            setLoading(false);
        }
    };
    // uncomment this section to test job creation
    // /*
    useEffect(() => {
        async function fetchOffers() {
            try {
                const offersRes = await api.get('core/offers/');
                setOffers(offersRes.data);
                console.log('Offers received:', offersRes.data); 
            } catch (error) {
                console.error('Failed to load offers:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchOffers();
    }, []);
    // */

    const removeOffer = (offerId) => {
        setOffers(prev => prev.filter(o => o.offer_id !== offerId));
    };

    return (
        <Layout heading="Offers">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {role === "organization" && (
                    <div className="mt-4">
                        <OfferFilter onApply={applyFilters} />
                    </div>
                )}
                {role === "vendor" && (
                    <div className="mt-4">
                        <VendorOfferFilter onApply={applyFilters} />
                    </div>
                )}
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {offers.map((offer, index) => {
                        if (role === "organization") {
                            return <Offer key={offer.offer_id ?? `fallback-${index}`} offer={offer} onChangeStatus={removeOffer} />;
                        }
                        if (role === "vendor") {
                            return <VendorOffer key={offer.offer_id ?? `fallback-${index}`} offer={offer} deleteOffer={removeOffer} />;
                        }
                        return null;
                    })}
                    {offers.length === 0 && (
                        <div>You have no job offers at this time.</div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Offers;