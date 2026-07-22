// components/dashboard/StatCard.jsx

import "./StatCard.css";

export default function StatCard({
    title,
    value,
    subtitle,
    icon
}) {

    return (

        <div className="stat-card">

            <div className="stat-header">

                <span>{icon}</span>

                <p>{title}</p>

            </div>

            <h2>{value}</h2>

            {subtitle && (
                <small>{subtitle}</small>
            )}

        </div>

    );

}