import React, { Component } from 'react';
import * as eCharts from 'echarts';
import { Card } from 'antd'; // 假设使用了antd的Card组件

export default class PieChart extends Component {
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

    // 获取饼状图的配置项
    getOption = () => {
        const { title, dataName, chartData } = this.props;

        return {
            title: {
                text: title,
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            grid: {
                show: 'true',
                borderWidth: '0',
            },
            series: [
                {
                    name: dataName,
                    type: 'pie',
                    radius: '50%',
                    data: chartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };
    };

    render() {
        const { title, dataName, chartData, description } = this.props; // 获取传递的属性

        return (
            <Card>
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
            </Card>
        );
    }
}
