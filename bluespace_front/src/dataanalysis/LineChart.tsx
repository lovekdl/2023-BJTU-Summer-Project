import React, { Component } from 'react';
import * as eCharts from 'echarts';

// 测试数据
const data = [
    [0, 0],
    [1, 1],
    [2, 4],
    [3, 9],
    [4, 16],
    [5, 25],
    [6, 36]
];

class LineChart extends Component {
    // 获取折线图的配置项
    getOption = () => {
        return {
            title: {
                text: 'y = x^2',
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
                    name: 'y = x^2',
                    type: 'line',
                    data
                }
            ]
        };
    };

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

    render() {
        return <div ref={(ref) => (this.chartRef = ref)} style={{ width: '600px', height: '400px' }} />;
    }
}

export default LineChart;
