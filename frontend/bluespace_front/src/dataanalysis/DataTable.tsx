import React from 'react';
import ReactECharts from 'echarts-for-react';

function MyTable() {
    // 生成一个356x5000的二维数组作为数据源
    const data = [];
    for (let i = 0; i < 356; i++) {
        const row = [];
        for (let j = 0; j < 5000; j++) {
            row.push(Math.random() * 100);
        }
        data.push(row);
    }

    // 定义表格的配置项
    const option = {
        dataset: {
            source: data,
        },
        tooltip: {},
        grid: {
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: Array.from({ length: 5000 }, (_, i) => i + 1), // x轴标签为1到5000
        },
        yAxis: {
            type: 'category',
            data: Array.from({ length: 356 }, (_, i) => i + 1), // y轴标签为1到356
        },
        series: [
            {
                name: '数据',
                type: 'bar',
                encode: {
                    x: -1, // 使用最后一列作为x轴
                    y: -2, // 使用倒数第二列作为y轴
                },
                label: {
                    show: true,
                    formatter: function (params) {
                        return params.value[2]; // 显示数值
                    },
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 0.5,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '800px' }} />;
}

export default MyTable;
