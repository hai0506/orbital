import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const MostSold = ({ data, total }) => {
    const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#ccc"];
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
                    ? `${data[activeIndex].value} ${data[activeIndex].name}`
                    : `${total} Total`}
            </div>
        </div>
    )
}

export default MostSold;