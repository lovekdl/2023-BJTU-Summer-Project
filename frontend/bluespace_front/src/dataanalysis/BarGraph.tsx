import React, { PureComponent } from "react";
import * as eCharts from "echarts";
import {Card} from "antd";

export default class BarGraph extends PureComponent {

    // 更新echarts实例
    componentDidUpdate() {
        this.chart.setOption(this.getOption());
    }

    // 销毁echarts实例
    componentWillUnmount() {
        this.chart.dispose();
    }
    componentDidMount() {
        //const myChart = eCharts.init(this.eChartsRef.current);

        this.chart = eCharts.init(this.chartRef);
        this.chart.setOption(this.getOption());
    }
    getOption = () =>{
        const { title, dataName, chartData1, chartData2 } = this.props;
        let option = {
            title: {
                text: title,
            },
            tooltip: {},
            legend: {
                data: ["宜居", '不宜居'],
            },
            grid: {
                show: 'true',
                borderWidth: '0'
            },
            xAxis: {
                //data: ["Orbit_period", "Semi_major_axis", "Mass", "Radius", "Stellar_luminosity", "Stellar_Radius", "Stellar_Mass"],
                data: dataName,
                axisLabel:{
                    rotate: -25,
                }

            },
            yAxis: {},
            series: [
                {
                    name: "宜居",
                    type: "bar",
                    data: chartData1,
                },
                {
                    name: "不宜居",
                    type: "bar",
                    data: chartData2,
                },
            ],
        };
        return option;
    };

    render() {
        const { title, dataName, chartData1, chartData2, description } = this.props; // 获取传递的属性

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
