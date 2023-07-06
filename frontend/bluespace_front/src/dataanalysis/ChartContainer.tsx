// ChartContainer.tsx
import React from "react";
import { Chart } from "./Chart";

interface ChartContainerProps {
    option: echarts.EChartsOption; // echarts的配置选项
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ option }) => {
    return (
        <div style={{ width: "600px", height: "400px", margin: "0 auto" }}>
            {/* 设置一个固定大小和居中的容器 */}
            <Chart option={option} /> {/* 引入Chart组件，并传入option属性 */}
        </div>
    );
};
