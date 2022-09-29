import {
    Table
} from 'react-bootstrap'
import styles from './Details.module.css';

export default function Details(props){
    const tables = props.ipDetails ? props.ipDetails.map((details) => {
        const thead = Object.keys(details).map((header) => (
            <th className={styles['result-header']}>{header}</th>
        ));
        const tbody = Object.values(details).map((value) => (
            <td className={styles['result-text']}>{value}</td>
        ));
        return (
            <div className='container text-center d-flex justify-content-center'>
                <Table className={styles['details-table']}>
                    <thead>
                        <tr>
                           {thead}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                           {tbody}
                        </tr>
                    </tbody>
                </Table>
            </div>  
        )
    }) : (
        <>
            <div className='container text-center d-flex justify-content-center'>
                <h3 className={styles['error-message']}>An error occurred with your query.</h3>
            </div>
            <div className='container text-center d-flex justify-content-center'>
                <h5 className={styles['error-message']}>if you think this is a mistake then please contact an administrator. </h5>
            </div>
        </>
    );
    return (
        <div id={styles['details']}>
            {tables}
        </div>
    )
}

