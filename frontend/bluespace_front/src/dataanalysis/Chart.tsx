// Chart.tsx
import React, { useEffect, useRef } from "react";
import echarts from "echarts";

interface ChartProps {
    option: echarts.EChartsOption; // echarts的配置选项
}

export const Chart: React.FC<ChartProps> = ({ option }) => {
    const chartRef = useRef<HTMLDivElement>(null); // 获取div元素的引用
    useEffect(() => {
        if (chartRef.current) {
            // 如果div元素存在
            const chart = echarts.init(chartRef.current); // 初始化echarts实例
            chart.setOption(option); // 设置echarts的配置选项
        }
    }, [option]); // 当option变化时，重新渲染echarts实例
    return <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>; // 返回一个div元素，用于渲染echarts实例
};
