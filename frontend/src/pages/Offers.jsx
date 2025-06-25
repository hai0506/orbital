import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Offer from '../components/Offer'
import offers from '../data/Offers'

const Offers = () => {
    const role = localStorage.getItem("ROLE");
    //const [offers, setOffers] = useState([]);

    // uncomment this section to test job creation
    /*
    useEffect(() => {
        async function fetchOffers() {
        try {
            if (role === 'organization') {
                const offersRes = await api.get('core/offers/');
                setOffers(offersRes.data);
                offers.map(offer => console.log(offer));
            }
        } catch (error) {
            console.error('Failed to load offers:', error);
        } finally {
            setLoading(false);
        }
        }

        fetchOffers();
    }, []);
    */

    return (
        <Layout heading="Offers">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {offers.map((offer, index) => (
                    <Offer key={offer.id || index} fields={offer} />
                ))}
            </div>
        </Layout>
    )
}

export default Offers;