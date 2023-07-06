import React, { PureComponent } from "react";
import * as eCharts from "echarts";

export default class BarGraph extends PureComponent {
    eChartsRef: any = React.createRef();

    componentDidMount() {
        const myChart = eCharts.init(this.eChartsRef.current);

        let option = {
            series: [
                {
                    name: "数据",
                    type: "gauge",
                    min: 0,
                    max: 1,
                    axisLine: {
                        lineStyle: {
                            color: [[0.2, "#c23531"], [0.5, "#63869e"], [1, "#91c7ae"]],
                            width: 30
                        }
                    },
                    pointer: {
                        itemStyle: {
                            color: "auto"
                        }
                    },
                    axisTick: {
                        distance: -30,
                        length: 8,
                        lineStyle: {
                            color: "auto",
                            width: 2
                        }
                    },
                    splitLine: {
                        distance: -30,
                        length: 30,
                        lineStyle: {
                            color: "auto",
                            width: 4
                        }
                    },
                    axisLabel: {
                        color: "auto",
                        distance: 40,
                        fontSize: 20
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: "{value}",
                        color: "auto"
                    },
                    data: [
                        {
                            value: 0.75
                        }
                    ]
                }
            ]
        };

        myChart.setOption(option);
    }

    render() {
        return <div ref={this.eChartsRef} style={{
            width: 600,
            height: 400,
            margin: 100
        }}></div>;
    }

}
