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
    }

    //words to filter out of main list: set, long, short,
    componentDidMount() {
        axios.get('https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/coinList.json')
            .then(response =>{
                console.log(response);
                let coinList = Object.values(response.data);
                coinList = coinList.sort((a,b) => a.SortOrder - b.SortOrder);
                // const filteredList = this.filterFetchedCoins(response.data);
                console.log(coinList);
                // axios.put("https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/coinList.json", coinList)
                //     .then(response => console.log(response))
                //     .catch(error => console.log(error));
                this.setState({ coinList, coinsLoaded: true });
            })
            .catch(error=>{
                this.setState({error});
            })
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
        list.length = 100;
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
        let matchedList = null;
        if(this.state.coinsLoaded){
            let coinList = [...this.state.coinList];
            let truncatedCoinList = this.truncateMatches(coinList);
            matchedList = <SearchResults matchedCoins={truncatedCoinList} />;
        }

        if (this.state.matchedCoins) {
            matchedList = <SearchResults matchedCoins={this.state.matchedCoins} />
        }
        
        return (
            <div>
                <form className="search-form">
                    <input type='text' className='search' onChange={(event) =>this.handleChange(event)} placeholder='search for a coin'></input>
                </form>
                <ul style={{listStyle: 'none'}}>
                    {matchedList}
                </ul>
            </div>
        );
    }
}

export default search;