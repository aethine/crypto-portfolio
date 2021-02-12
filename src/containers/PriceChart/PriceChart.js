import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';


//create w & h consts for svg canvas. Append canvas to <body>. Use constants in code! To prevent typos
// append rect, title (tooltip), text/label (optional)
// use padding in the range. Remember to invert range for y values so it's displayed upright
//once scales are set, feed the attr x & y coords thru those fns. Don't apply scales when displaying the actual data values
// Remember to feed any label offset into the scale function when setting x on the <text>


class PriceChart extends Component {
    state = {
        priceData: null
    }
    
    componentDidMount(){
        axios.get("https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=10&api_key=f22619fe0a6172deeddfe6731c7afcb34f1a0f5ea0f4a6b519449f81ad0f69f0")
            .then(response => {
                this.setState({priceData: response.data.Data.Data});
                this.state.priceData.forEach(datum => {
                    console.log(datum.time)
                    let date = new Date(datum.time * 1000);
                    console.log(date)
                })
            });
        const svg = d3.select("#test")
        svg.style("stroke-width", 5)
            .style('color', 'brown')
            .style('background-color', 'yellow');
        d3.select('rect').attr('fill', 'brown');
    }

    render() {
        const w = "100%";
        const h = "100%";
        return (
            <div className="PriceChart">
                <svg>
                    <rect className="target" width={w} height={h} color="blue">

                    </rect>
                </svg>
                    <p id="test">This is some text to test</p>
            </div>
        )
    }
}

export default PriceChart;