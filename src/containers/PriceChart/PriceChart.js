import React, { Component } from 'react';
import * as d3 from 'd3';

class PriceChart extends Component {

    componentDidMount(){
        const svg = d3.select("#test")
        svg.style("stroke-width", 5)
            .style('color', 'brown')
            .style('background-color', 'yellow');
        d3.select('rect').attr('fill', 'brown');
    }

    render() {
        return (
            <div className="PriceChart">
                <svg>
                    <rect className="target" width="100%" height='100%' color="blue">

                    </rect>
                </svg>
                    <p id="test">This is some text to test</p>
            </div>
        )
    }
}

export default PriceChart;