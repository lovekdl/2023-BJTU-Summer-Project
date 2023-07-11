import React, { Component } from 'react';
import * as eCharts from 'echarts';

// 测试数据
const data = [
    { name: '苹果', value: 335 },
    { name: '香蕉', value: 310 },
    { name: '橘子', value: 234 },
    { name: '梨子', value: 135 },
    { name: '葡萄', value: 1548 }
];

class PieChart extends Component {
    // 获取饼状图的配置项
    getOption = () => {
        return {
            title: {
                text: '水果销量',
                subtext: '测试数据',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            grid: {
                show: 'true',
                borderWidth: '0'
            },
            series: [
                {
                    name: '水果',
                    type: 'pie',
                    radius: '50%',
                    data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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

export default PieChart;
