import BestVendor from "./BestVendor"; 

const OrgDashboard = ({ fundraiser }) => {
    const temp = {};
    let total = 0;
    fundraiser?.vendors?.forEach(vendor => {
        const revenue = vendor.revenue ?? 0;
        const commission = vendor.offer?.commission ?? 0;
        total += revenue * (commission / 100);
        temp[vendor.offer.vendor.username] = revenue * (commission / 100);
    })

    let tmp = Object.entries(temp).map(([name, value]) => ({
        name,
        value,
    }));

    tmp.sort((a, b) => b.value - a.value);

    const top = tmp.slice(0, 3);
    const bottom = tmp.slice(3).reduce((acc, cur) => acc + cur.value, 0);
    const data = bottom > 0
        ? [...top, { name: "Others", value: bottom }]
        : top;

    return (
        <>
            <h5 className="text-2xl font-semibold mb-2">Statistics</h5>
            {fundraiser?.vendors?.length <= 0 && (
                <p>No statistics available.</p>
            )}
            {fundraiser?.vendors?.length > 0 && (
                <div className="text-left">
                    <h3 className="font-semibold text-base mb-2">Revenue Sharing</h3>
                    <BestVendor data={data} total={total} />
                </div>
            )}
        </>
    )
}

export default OrgDashboard;