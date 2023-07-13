import React, { PureComponent } from "react";
import * as eCharts from "echarts";

export default class BarGraph extends PureComponent {

    eChartsRef: any = React.createRef();

    componentDidMount() {
        const myChart = eCharts.init(this.eChartsRef.current);

        let option = {
            title: {
                text: "Planet Data",
            },
            tooltip: {},
            legend: {
                data: ["Value"],
            },
            grid: {
                show: 'true',
                borderWidth: '0'
            },
            xAxis: {
                data: ["Orbit_period", "Semi_major_axis", "Mass", "Radius", "Stellar_luminosity", "Stellar_Radius", "Stellar_Mass"],
                axisLabel:{
                    rotate: -20,
                }

            },
            yAxis: {},
            series: [
                {
                    name: "Value",
                    type: "bar",
                    data: [5, 20, 36, 10, 10, 20, 10],
                },
            ],
        };

        myChart.setOption(option);
    }

    render() {
        return <div ref={this.eChartsRef} style={{
            width: 900,
            height: 600,
            //margin: 100
        }}></div>;
    }
}
