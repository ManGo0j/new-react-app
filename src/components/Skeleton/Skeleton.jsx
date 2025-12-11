import styles from "./style.module.css";

const Skeleton = ({ count = 1, type = "banner" }) => {
  if (type === "banner") {
    return <div className={styles.banner}></div>;
  }

  if (count > 1) {
    return (
      <ul className={styles.list}>
        {[...Array(count)].map((_, index) => (
          <li key={index} className={styles.item}></li>
        ))}
      </ul>
    );
  }

  return <div className={styles.item}></div>;
};

export default Skeleton;
