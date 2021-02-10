import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';

import classes from './OrderForm.module.css';

class OrderForm extends Component {
    state = {
        buyOrder: true,
        USDAmount: 0,
        tokenAmount: 0,
        formIsValid: false
    }

    componentDidUpdate(prevProps, prevState){
        //check for validity after order submission
        if(this.props.availableUSD !== prevProps.availableUSD){
        let formIsValid = this.state.USDAmount <= this.props.availableUSD;
            this.setState({formIsValid});
        }
    }

    toggleOrderType = (e) => {
        e.preventDefault();
        console.log(this.state.buyOrder)
        const orderType = this.state.buyOrder;
        this.setState({ buyOrder: !this.state.buyOrder});
    }

    checkFormValidity = (USDAmount, tokenAmount) => {
        let formIsValid;
        const availableToken = this.props.wallet.tokenBalances[this.props.symbol];
        if(this.state.buyOrder){
            formIsValid = this.props.availableUSD >= USDAmount;
        } else {
            if(availableToken){
                formIsValid = availableToken.balance >= tokenAmount;
            } else {
                formIsValid = false;
            }
        }
        return formIsValid;
    }

    handleUSDChange = (e) => {
        const tokenAmount = e.target.value / this.props.currentPrice;
        let formIsValid = this.checkFormValidity(e.target.value, tokenAmount);
        this.setState({
            USDAmount: e.target.value,
            tokenAmount,
            formIsValid
        })

    }

    handleTokenChange = (e) => {
        const USDAmount = (e.target.value * this.props.currentPrice);
        let formIsValid = this.checkFormValidity(USDAmount, e.target.value);
        this.setState({
            USDAmount,
            tokenAmount: e.target.value,
            formIsValid
        })
    } 

    orderHandler(e, USDAmount, tokenAmount) {
        e.preventDefault();
        console.log(USDAmount);
        this.props.orderHandler(this.state.buyOrder, parseFloat(USDAmount), tokenAmount);
    }

    render() {
        let buySellBtns = null;
        if(this.state.buyOrder){
            buySellBtns = (
                <form id="buySellbtns" onSubmit={(e) => this.toggleOrderType(e)}>
                    <Button btnType='Success'>Buy</Button>
                    <Button>Sell</Button>
                </form>
            )
        } else {
            buySellBtns = (
                <form id="buySellbtns" onSubmit={this.toggleOrderType}>
                    <Button>Buy</Button>
                    <Button btnType='Danger'>Sell</Button>
                </form>
            )
        }
        let orderBtn = this.state.buyOrder ? (
            <Button btnType='Success' disabled={!this.state.formIsValid}>Buy {this.props.symbol}</Button>
        ) : (
            <Button btnType='Danger' disabled={!this.state.formIsValid}>Sell {this.props.symbol}</Button>
        )
        return (
            <div className={classes.OrderForm}>
                {buySellBtns}
                <form id="orderForm" onSubmit={(e)=> this.orderHandler(e, parseInt(this.state.USDAmount), parseInt(this.state.tokenAmount))}>
                    
                    <p>Amount({this.props.symbol})</p>

                    <input type='number' step='any' value={this.state.tokenAmount} onChange={(event) => this.handleTokenChange(event)}/>

                    <p>Amount(USD)</p>

                    <input type='number' step='any' value={this.state.USDAmount} onChange={(event) => this.handleUSDChange(event)}/>

                    <br/>
                    {orderBtn}
                </form>
            </div>  
        )
    }
};

export default OrderForm;