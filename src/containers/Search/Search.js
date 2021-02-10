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
        touched: false,
        error: null,
    }

    //words to filter out of main list: set, long, short,
    componentDidMount() {
        axios.get('https://min-api.cryptocompare.com/data/all/coinlist')
            .then(response =>{
                console.log(Object.values(response.data.Data));
                const coinList = Object.values(response.data.Data);
                // const filteredList = this.filterFetchedCoins(response.data);
                this.setState({ coinList });
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
        const matchedCoins = this.state.coinList.filter(coin => {
            return coin.Symbol.match(regex);
        });
        this.setState({matchedCoins});
    }

    loadCoin = (id) => {
        <Link to={{ pathname: '/trade/' + id, search: id }} />;
        // this.props.history.push({ pathname: '/trade/' + id});
    }

    handleChange = (event) => {
        if(event.target.value.length >= 3) {
            this.setState({formValue: event.target.value, touched: true});
            this.filterMatches(event.target.value, this.state.coinList)
        }
    }

    render () {
        let matchedList = null;
        if (this.state.touched) {
            console.log('touched');
            if (this.state.error) {
                matchedList = <p style={{ textAlign: 'center' }}>Results can't be loaded.</p>;
            } else {
                matchedList = <div><Spinner /></div>
            }
            console.log(matchedList);
        }

        if (this.state.matchedCoins) {
            matchedList = <SearchResults matchedCoins={this.state.matchedCoins} />
            console.log(matchedList);
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