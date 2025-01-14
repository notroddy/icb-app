import styles from './StatCard.module.css';

/**
 * StatCard component to display a statistic.
 * @param {Object} props - Component props.
 * @param {string} props.title - Title of the statistic.
 * @param {string|number} props.value - Value of the statistic.
 */
const StatCard = ({ title, value }) => (
    <div className={styles["stat-card"]}>
        <p>{value}</p>
        <h4>{title}</h4>
    </div>
);

export default StatCard;
