import { useState } from 'react';
import MostSold from './MostSold';
import MostValuable from './MostValuable';
import RevenueSharing from './RevenueSharing';

const Dashboard = ({ fundraiser }) => {
    const commission = fundraiser.offer.commission;
    const transactions = fundraiser.transactions;

    // Revenue Sharing
    const revenue = fundraiser.revenue;
    const revenueSharing = [
        { name: "Donated", value: (commission / 100) * revenue},
        { name: "Received", value: ((100 - commission) / 100) * revenue},
    ]

    // Quantity Sold
    const tempQ = {};
    transactions.forEach((transaction) => {
        transaction.items.forEach((item) => {
            const productName = item.product.name;
            tempQ[productName] = (tempQ[productName] || 0) + item.quantity;
        });
    });

    let tmpQ = Object.entries(tempQ).map(([name, value]) => ({
        name,
        value,
    }));

    tmpQ.sort((a, b) => b.value - a.value);

    const topQuantity = tmpQ.slice(0, 3);
    const bottomQuantity = tmpQ.slice(3).reduce((acc, cur) => acc + cur.value, 0);
    const quantitySold = bottomQuantity > 0
        ? [...topQuantity, { name: "Others", value: bottomQuantity }]
        : topQuantity;
    
    // Most Valuable Items
    const tempV = {};
    transactions.forEach((transaction) => {
        transaction.items.forEach((item) => {
            const productName = item.product.name;
            tempV[productName] = (tempV[productName] || 0) + item.total_price;
        });
    });

    let tmpV = Object.entries(tempV).map(([name, value]) => ({
        name,
        value,
    }));

    tmpV.sort((a, b) => b.value - a.value);

    const topValue = tmpV.slice(0, 3);
    const bottomValue = tmpV.slice(3).reduce((acc, cur) => acc + cur.value, 0);
    const mostValuable = bottomValue > 0
        ? [...topValue, { name: "Others", value: bottomValue }]
        : topValue;

    return (
        <>
            <h5 className="text-2xl font-semibold mb-2">Statistics</h5>
            {transactions.length <= 0 && (
                <p>No statistics available.</p>
            )}
            {transactions.length > 0 && (
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <RevenueSharing data={revenueSharing} total={revenue} />
                        <MostSold data={quantitySold} total={quantitySold.reduce((acc, cur) => acc + cur.value, 0)} />
                        <MostValuable data={mostValuable} total={mostValuable.reduce((acc, cur) => acc + cur.value, 0)} />
                    </div>
                    <div className="grid grid-cols-2">
                        
                    </div>
                </>
            )}
        </>
    )
}

export default Dashboard