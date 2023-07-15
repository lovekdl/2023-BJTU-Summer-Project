import React, { Component } from 'react';
import * as eCharts from 'echarts';
import {Card} from "antd";

// 测试数据
const data = [
    [0, 0],
    [1, 2],
    [2, 3],
    [3, 1],
    [4, 6],
    [5, 2],
    [6, 6]
];



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
                type: 'value'
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Value',
                    type: 'line',
                    data: chartData
                }
            ]
        };
    };

    render() {
        const { title, chartData, description } = this.props; // 获取传递的属性
        return (<Card>
            <div style={{ display: 'flex' }}>
                <div
                    ref={(ref) => (this.chartRef = ref)}
                    style={{ width: '600px', height: '400px' }}
                ></div>
                <div style={{ marginLeft: '20px' }}>
                    <h2>{title}</h2>
                    <p>{description}</p> {/* 显示图表的说明 */}
                </div>
            </div>
        </Card>);
    }
}

