import { formatDate } from "../../helpers/formateDate"
import styles from './style.module.css'

const Header = ( ) => {
    return(
        <header  className={styles.header}> 
            <h1 className={styles.title}>NEWS</h1>
            <p className={styles.date}>{formatDate(new Date)}</p>
        </header>
    )
}

export default Header