import LineChart from "../dataanalysis/LineChart"
import Gauge from "../dataanalysis/Gauge"
import PieChart from "../dataanalysis/PieChart";
import {Layout, message, Pagination} from 'antd';
import { useState } from "react";
export default function PredictionChart() {
  const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 1; // 每页显示的图表组件数量




    const handlePageChange = (page:any) => {
        setCurrentPage(page);
    };

    const renderChartComponent = (pageNumber:any) => {
        switch (pageNumber) {
            case 1:
                let title1 = '该星球宜居度预测值'
                let dataName1 = '宜居度'
                let chartData1 = 0.3
                return (
                    <div style={{height:"500"}}>
                        {<Gauge title={title1} dataName={dataName1} chartData={chartData1} />}
                    </div>
                );
            case 2:
                // 第二页的图表组件
                let title2 = '该星球各项数据与地球对比'
                let dataName2 = '随便填什么都可以'
                let chartData2 = [0.25, 1.78, 3.82, 0.6, 0.63, -1.16]
                return (
                    <div style={{height:"500"}}>
                        {<LineChart title={title2} dataName={dataName2} chartData={chartData2} />}
                    </div>
                );
            // 添加更多页面的图表组件
            default:
                return null;
        }
    };

    const totalPages = 2; // 总页数，根据实际需求设置

    return (
        <div className='PageContainer2'>
            {renderChartComponent(currentPage)}
            <Pagination
                current={currentPage}
                total={totalPages}
                pageSize={pageSize}
                onChange={handlePageChange}
                className="PaginationBottom"
            />
        </div>
    );
}