import './styles/StatCard.css';


const StatCard = ({ title, value }) => (
    <div className="stat-card">
        
        <p>{value}</p>
        <h4>{title}</h4>
    </div>
);

export default StatCard;
