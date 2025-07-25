import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const RevenueSharing = ({ data, total }) => {
    const COLORS = ["#ddd", "#4CAF50"];
    const [activeIndex, setActiveIndex] = useState(null);

    const onPieEnter = (_, index) => setActiveIndex(index);
    const onPieLeave = () => setActiveIndex(null);

    return (
        <div style={{ position: "relative", width: 200, height: 200 }}>
            <PieChart width={200} height={200}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

                <Tooltip
                    position={{ x: 220, y: 100 }} 
                    contentStyle={{ fontSize: '12px' }}
                />
            </PieChart>

            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 21,
                    fontWeight: "bold",
                    pointerEvents: "none",
                    width: 100,          
                    textAlign: "center", 
                    lineHeight: 1.2,     
                    userSelect: "none",  
                }}
            >
                {activeIndex !== null
                    ? `$${data[activeIndex].value.toFixed(2)} ${data[activeIndex].name}`
                    : `$${total.toFixed(2)} Total`}
            </div>
            <div style={{ marginTop: 16 }}>
                {data.map((entry, index) => (
                    <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: COLORS[index % COLORS.length],
                                marginRight: 8,
                                borderRadius: 2,
                            }}
                        />
                        <span style={{ fontSize: 14 }}>{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RevenueSharing;