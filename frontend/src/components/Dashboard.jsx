import { useState } from 'react';
import DonutChart from './DonutChart';

const Dashboard = ({ fundraiser }) => {
    const commission = fundraiser.offer.commission;
    const transactions = fundraiser.transactions;
    const revenue = transactions.reduce(
        (acc, transaction) => acc + transaction.total_price,
        0
    );
    console.log(revenue);
    console.log(commission);
    const revenueSharing = [
        { name: "donated", value: (commission / 100) * revenue},
        { name: "kept", value: ((100 - commission) / 100) * revenue},
    ]

    console.log(revenueSharing);

    return (
        <>
            <h5 className="text-2xl font-semibold mb-2">Statistics</h5>
            {transactions.length <= 0 && (
                <p>No statistics available.</p>
            )}
            {transactions.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <DonutChart data={revenueSharing} total={revenue} />
                </div>
            )}
        </>
    )
}

export default Dashboard