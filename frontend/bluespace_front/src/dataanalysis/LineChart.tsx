import React, { Component } from 'react';
import * as eCharts from 'echarts';
import { Card } from "antd";

export default class LineChart extends Component {
    // 创建echarts实例
    componentDidMount() {
        this.chart = eCharts.init(this.chartRef);
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

    // 获取折线图的配置项
    getOption = () => {
        const { title, chartData } = this.props;
        return {
            title: {
                text: title,
                left: 'center'
            },
            grid: {
                show: 'true',
                borderWidth: '0'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category', // 修改为'category'
                data: ["Semi_major_axis", "Mass", "Radius", "Stellar_luminosity", "Stellar_Radius", "Stellar_Mass"],
                axisLabel:{
                    rotate: -25,
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '地球',
                    type: 'line',
                    data: [1, 1, 1, 0, 1, 1]
                },
                {
                    name: '你的星球',
                    type: 'line',
                    data: chartData
                },
            ]
        };
    };

    render() {
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
