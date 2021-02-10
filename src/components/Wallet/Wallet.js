import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Wallet.module.css';

const wallet = (props) => {
    const tokens = props.wallet.tokenBalances;
    let tokenBalances = [];
    for (const [key, value] of Object.entries(tokens)){
        tokenBalances.push(
        <tr id={key} onClick={() => props.loadCoin(key, value.name)}>
            <td id='symbol'>    
                <Link to={{ pathname: '/trade', state: { symbol: key, coinName: value.name} }}  style={{textDecoration: 'none'}}>
                    <li id={value.name} style={{textDecoration: 'none', color: 'black', listStyle: 'none'}}><strong>{key}</strong></li>
                </Link></td>
            <td id='name'>{value.name}</td>
            <td id='balance'>{value.balance}</td>
            <td id='USDValue'>${value.USDValue}</td>
        </tr>
        )
    }  
    
    return (
        <div className={classes.Wallet}>
            <table>
                <tbody>
                     {tokenBalances}
                </tbody>
            </table>
        </div>
    );
}

export default wallet;