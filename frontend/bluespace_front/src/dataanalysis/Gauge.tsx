import React, { PureComponent } from "react";
import * as eCharts from "echarts";
import axios from "axios";
import {http} from "../utils";
import {message} from "antd";

export default class Gauge extends PureComponent {
    eChartsRef: any = React.createRef();

    async componentDidMount() {
        const myChart = eCharts.init(this.eChartsRef.current);

        // 发送异步请求获取数据
        try {
            const ret = await http.post('api/linear_predict', {
            })
            if (ret.data.state == 'success') {
                const option = this.createChartOption(ret.data);
                myChart.setOption(option);
            } else message.error('unknown error.')
        } catch (e: any) {
            console.log('catch : ', e)
            if (e.response) message.error(e.response.data.error_message)
            else message.error(e.message)
        }
    }

    createChartOption(data) {
        const option = {
            series: [
                {
                    name: "数据",
                    type: "gauge",
                    min: 0,
                    max: 1,
                    axisLine: {
                        lineStyle: {
                            color: [[0.2, "#91c7ae"], [0.8, ""], [1, "#c23531"]],
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
                    grid: {
                        show: 'true',
                        borderWidth: '0'
                    },
                    data: [
                        {
                            value: data.habitable_rate, // 使用获取到的数据更新图表的值
                            name: "星球宜居度"
                        }
                    ]
                }
            ]
        };

        return option;
    }

    render() {
        return <div
            ref={this.eChartsRef}
            style={{
                width: 600,
                height: 400,
                margin: 100
            }}
        ></div>;
    }
}
