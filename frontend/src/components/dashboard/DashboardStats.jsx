import StatCard from "./StatCard";

export default function DashboardStats() {

    return (

        <div className="dashboard-stats">

            <StatCard
                title="Total Resumes"
                value="8"
            />

            <StatCard
                title="Average Score"
                value="86"
            />

            <StatCard
                title="Highest Score"
                value="92"
            />

            <StatCard
                title="Average ATS"
                value="84"
            />

        </div>

    );

}