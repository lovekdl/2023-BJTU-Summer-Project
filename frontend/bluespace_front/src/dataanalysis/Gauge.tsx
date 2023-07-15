import React, { PureComponent } from "react";
import * as eCharts from "echarts";
import axios from "axios";
import {http} from "../utils";
import {Card, message} from "antd";
import i18n from '../index.tsx';
import {useTranslation} from 'react-i18next'
export default class Gauge extends PureComponent {
    eChartsRef: any = React.createRef();

    componentDidMount() {
        this.chart = eCharts.init(this.chartRef);

        // 发送异步请求获取数据
        // try {
        //     const ret = await http.post('api/linear_predict', {
        //     })
        //     if (ret.data.state == 'success') {
        //         const option = this.createChartOption(ret.data);
        //         myChart.setOption(option);
        //     } else message.error('unknown error.')
        // } catch (e: any) {
        //     console.log('catch : ', e)
        //     if (e.response) message.error(e.response.data.error_message)
        //     else message.error(e.message)
        // }
        this.chart.setOption(this.getOption());
    }

    // 更新echarts实例
    componentDidUpdate() {
        this.chart.setOption(this.getOption());
    }

    // 销毁echarts实例
    componentWillUnmount() {
        this.chart.dispose();
    }
    getOption(data) {
        const { title, dataName,  chartData } = this.props;
        const option = {
            title: {
                text: title,
            },
            series: [
                {
                    name: dataName,
                    type: "gauge",
                    min: 0,
                    max: 1,
                    axisLine: {
                        lineStyle: {
                            color: [[0.3, '#DC143C'], [0.7, "#FFA500"], [1, "#4169E1"]],
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
                        length: 6,
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
                            value: chartData, // 使用获取到的数据更新图表的值
                            name: i18n.t(dataName)
                        }
                    ]
                }
            ]
        };

        return option;
    }

    render() {
        const { title, dataName, chartData } = this.props; // 获取传递的属性

        return (
            <Card>
                <div style={{ display: 'flex' }}>
                    <div
                        ref={(ref) => (this.chartRef = ref)}
                        style={{ width: '600px', height: '400px' }}
                    ></div>
                </div>
            </Card>
        );
    }
}
