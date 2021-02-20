import React, { Component } from 'react';
import OrderForm from './Order/OrderForm';
import PriceChart from '../PriceChart/PriceChart';
import Wallet from '../../components/Wallet/Wallet';

import axios from 'axios';

class Trade extends Component {
    state = {
        symbol: 'BTC',
        coinName: "Bitcoin",
        currentPrice: null,
        priceHistory: null,
        orders: null,
        wallet: {
              totalAccountBalance: 10000,
              tokenBalances: {
                'USD': { name: 'US Dollars', price: 1, balance: 5000, USDValue: 5000 },
                'ETH': { name: 'Ethereum', price: 500, balance: 10, USDValue: 5000 },
                'BTC': { name: 'Bitcoin', price: 32000, balance: .01, USDValue: 320 }
              },
            }
    }

    componentDidMount() {
        this.loadCoin();
    }

    loadCoin(newSymbol, newCoinName) {
        const symbol = newSymbol || this.props.location.state.symbol || this.state.symbol;
        const coinName = newCoinName || this.props.location.state.coinName || this.state.coinName;
        let wallet, currentPrice;
        // axios.get("https://api.cryptowat.ch/markets/kraken/btceur/price")
        axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + symbol + "&tsyms=USD&api_key=f22619fe0a6172deeddfe6731c7afcb34f1a0f5ea0f4a6b519449f81ad0f69f0")
            .then(response => {
                currentPrice = response.data.USD;
                axios.get("https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/wallet.json")
                    .then(response => {
                        wallet = response.data;
                        console.log(wallet);
                        this.setState({ currentPrice, symbol, coinName, wallet });
                        this.updateWalletBalances();
                    })
                
            });
    }

    updateTotalAccountBalance() {
        let updatedAccountBalance = 0;
        const tokens = Object.keys(this.state.wallet.tokenBalances)
        tokens.forEach(token => {
            updatedAccountBalance += parseInt(this.state.wallet.tokenBalances[token].USDValue);
        })
        return updatedAccountBalance;
    }

    updateWalletBalances() {
        let tokenBalances = {...this.state.wallet.tokenBalances};
        let tokenSymbols = [];
        let updatedTokenPrices = null;
        let updatedAccountBalance = 0;
        for (const symbol of Object.keys(tokenBalances)){
            if(symbol !== 'USD'){
                tokenSymbols.push(symbol);
            }
        }
        const tokenAPIString = tokenSymbols.join(',');
        axios.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + tokenAPIString + "&tsyms=USD&api_key=f22619fe0a6172deeddfe6731c7afcb34f1a0f5ea0f4a6b519449f81ad0f69f0")
            .then(response => {
                updatedTokenPrices = response.data;
                for (const symbol of Object.keys(updatedTokenPrices)){
                    if(symbol !== 'USD'){
                        tokenBalances[symbol].price = updatedTokenPrices[symbol]['USD'];
                        tokenBalances[symbol].USDValue = (updatedTokenPrices[symbol]['USD'] * tokenBalances[symbol].balance).toFixed(2);
                    }
                }
                //update total account balance after API call
                const tokens = Object.keys(this.state.wallet.tokenBalances)
                tokens.forEach(token => {
                    updatedAccountBalance += parseInt(this.state.wallet.tokenBalances[token].USDValue);
                 })
                let wallet = {
                    'totalAccountBalance': updatedAccountBalance,
                    'tokenBalances': tokenBalances
                }
                this.setState({wallet})
            })
            .catch(error => console.log(error));
        
            
        
    }

    orderHandler(orderType, USDAmount, tokenAmount) {
        let wallet = {...this.state.wallet};
        //either buy or sell depending on orderType boolean
        if(orderType){
            wallet.tokenBalances['USD'].balance = wallet.tokenBalances['USD'].balance - USDAmount;
            wallet.tokenBalances['USD'].USDValue -= USDAmount;
            //check if token already in wallet, create entry otherwise, and update token balance
            if (wallet.tokenBalances[this.state.symbol]){
                wallet.tokenBalances[this.state.symbol].balance += tokenAmount;
            } else {
                wallet.tokenBalances[this.state.symbol] = { name: this.state.coinName, price: this.state.currentPrice, balance: tokenAmount, USDValue: tokenAmount * this.state.currentPrice }
            }
        } else {
            wallet.tokenBalances['USD'].balance = wallet.tokenBalances['USD'].balance + USDAmount;
            wallet.tokenBalances['USD'].USDValue += USDAmount;
            wallet.tokenBalances[this.state.symbol].balance -= tokenAmount;
        }

        this.setState({wallet});
        this.updateWalletBalances();
        axios.put("https://crypto-portfolio-70bc1-default-rtdb.firebaseio.com/wallet.json", wallet)
            .then(response => console.log(response));
    }

    render () {
        let priceData = null;
        if (this.state.symbol && this.state.currentPrice) {
            priceData = <p>{this.state.coinName} is trading at {this.state.currentPrice} USD</p>
        }
        return (
            <div>
                <div>
                    {priceData}
                </div>
                <PriceChart />
                <div>
                    <p>Account Balance: ${this.state.wallet.totalAccountBalance}USD</p>
                    <p>Available Balance: ${this.state.wallet.tokenBalances['USD'].balance}</p>
                </div>
                <OrderForm 
                    symbol={this.state.symbol} 
                    currentPrice={this.state.currentPrice} 
                    availableUSD={this.state.wallet.tokenBalances['USD'].balance}
                    tokenBought={this.tokenBought}
                    orderHandler={(orderType, USDAmount, tokenAmount)=> this.orderHandler(orderType, USDAmount, tokenAmount)}
                    wallet={this.state.wallet} />
                <Wallet wallet={this.state.wallet} loadCoin={(symbol, coinName) => this.loadCoin(symbol, coinName)}/>

            </div>

        );
    }
}

export default Trade;