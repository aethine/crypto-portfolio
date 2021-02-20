import React from 'react';

import { Link } from 'react-router-dom';

import classes from './SearchResults.module.css'

const searchResults = (props) => {
    console.log(props.matchedCoins[0])
    const coinList = [];
    props.matchedCoins.forEach((coin, i) => {
        const linkString = `/trade?symbol=${coin.Symbol}&name=${coin.CoinName}`
        coinList.push(
            <Link key={i} to={{ pathname: '/trade', state: { symbol: coin.Symbol, coinName: coin.CoinName} }}  style={{textDecoration: 'none'}}>
                <li id={coin.CoinName}><strong>{coin.Symbol}</strong> - ${coin.Price}</li>
            </Link>
        );
    });
    console.log(coinList);
    return (
        <div className={classes.Results}>
            {coinList}
        </div>
    );
};

export default searchResults;