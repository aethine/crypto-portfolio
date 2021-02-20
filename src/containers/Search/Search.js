import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Spinner from '../../components/UI/Spinner/Spinner';
import SearchResults from '../../components/SearchResults/SearchResults';

class search extends Component {
    state = {
        coinList: [],
        formValue: null,
        matchedCoins: null,
        coinsLoaded: false,
        error: null,
        prices: null,
        searchStrings: null
    }

    //words to filter out of main list: set, long, short,
    componentDidMount() {
        let searchStrings = [];
        axios.get('https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/coinsWithPrices.json')
            .then(response =>{
                let coinList = Object.values(response.data);
                //coinList = coinList.sort((a,b) => a.SortOrder - b.SortOrder);
                // const filteredList = this.filterFetchedCoins(response.data);
                //  The below code is run once to upload the coin list to firebase
                //  axios.put("https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/coinList.json", coinList)
                //     .then(response => console.log(response))
                //     .catch(error => console.log(error));

                // code below was used to generate search strings of all the symbols in the original coinList. API char limit is 300
                // let index = 0;
                // let searchString = "";
                // console.log('test before loop')
                // while (index < 6076) {
                //     searchString = "";
                //     while ((searchString.length + coinList[index]["Symbol"].length) < 300 && index < 6076){
                //         searchString += coinList[index]["Symbol"];
                //         searchString += ",";
                //         index++;
                //     }
                //     searchString = searchString.slice(0, -1);
                //     searchStrings.push(searchString);
                // }
                // this.setState({coinList, searchStrings})


                // for(let i = 0; i < 184; i++){
                //     let coinListSymbols = [];

                //     for(let j = 0; j < 33; j++){
                //         coinListSymbols.push(coinList[(i * 184) + j]["Symbol"]);
                //         console.log(`i: ${i} j: ${j}. Last symbol: ${coinList[(i * 184) + j]["Symbol"]}`);
                //     }
                //     coinListSymbols = coinListSymbols.join(",");

                //     // axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + coinListSymbols + "&tsyms=USD&api_key=f22619fe0a6172deeddfe6731c7afcb34f1a0f5ea0f4a6b519449f81ad0f69f0")
                //     //     .then(response => {
                //     //         prices = Object.assign({}, prices, response.data);
                //     //         console.log(prices)
                //     //     })
                //     //     .catch(error => console.log(error));
                //     console.log(i, coinListSymbols)
                // }
                

                const matchedCoins = this.truncateMatches([...coinList]);
                let coinListSymbols = [];
                matchedCoins.forEach( coin => {
                    coinListSymbols.push(coin.Symbol);
                });
                coinListSymbols = coinListSymbols.join(",");
                console.log(coinListSymbols);
                axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + coinListSymbols + "&tsyms=USD&api_key=f22619fe0a6172deeddfe6731c7afcb34f1a0f5ea0f4a6b519449f81ad0f69f0")
                    .then(response => {
                        let prices = response.data;
                        console.log(prices);
                        matchedCoins.forEach( (coin, i) => {
                            coin.Price = prices[coin.Symbol]["USD"];
                        });
                        this.setState({ coinList, coinsLoaded: true, matchedCoins });
                    })
            })
            .catch(error=>{
                this.setState({error});
            })
    }

    fetchAndStorePrices = () => {
        let prices = {};
        this.state.searchStrings.forEach( searchString => {
            axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + searchString + "&tsyms=USD&api_key=f22619fe0a6172deeddfe6731c7afcb34f1a0f5ea0f4a6b519449f81ad0f69f0")
                .then(response => {
                    prices = Object.assign({}, prices, response.data);
                    console.log(prices);
                    this.setState({prices})
                })
                .catch(error => console.log(error));
        })
    }

    filterPricedCoins = () => {
        let coinsWithPrices = this.state.coinList.filter( coin => this.state.prices[coin["Symbol"]]);
        console.log(coinsWithPrices);
        axios.put("https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/coinsWithPrices.json", coinsWithPrices)
                .then(response => console.log(response))
                .catch(error => console.log(error));
    }

    filterFetchedCoins = (fetchedList) => {
        const filteredList = [];
        fetchedList.forEach(coin => {
            if(!coin.id.match( /set|long|short/g )){
                filteredList.push(coin);
            }
        });
        return filteredList;
    }

    filterMatches = (wordToMatch, coins) => {
        let regex = new RegExp(wordToMatch, 'gi');
        let matchedCoins = this.state.coinList.filter(coin => {
            return coin.Symbol.match(regex);
        });
        matchedCoins = this.truncateMatches(matchedCoins)
        this.setState({matchedCoins});
    }

    truncateMatches = (list) => {
        list.length = 60;
        return list;
    }

    loadCoin = (id) => {
        <Link to={{ pathname: '/trade/' + id, search: id }} />;
        // this.props.history.push({ pathname: '/trade/' + id});
    }

    handleChange = (event) => {
        this.setState({formValue: event.target.value});
        this.filterMatches(event.target.value, this.state.coinList)
    }

    render () {
        let matchedList = <Spinner/>

        if (this.state.matchedCoins) {
            matchedList = <SearchResults matchedCoins={this.state.matchedCoins} />
        }
        console.log('render method')
        return (
            <div>
                <form className="search-form">
                    <input type='text' className='search' onChange={(event) =>this.handleChange(event)} placeholder='search for a coin'></input>
                </form>
                <ul style={{listStyle: 'none'}}>
                    {matchedList}
                </ul>

                <button onClick={this.fetchAndStorePrices}>Get Prices!</button>
                <button onClick={this.filterPricedCoins}>Filter!</button>
            </div>
        );
    }
}

export default search;