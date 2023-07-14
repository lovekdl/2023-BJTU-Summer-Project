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
                let title = '';
                let dataName = '宜居度';
                let chartData = [
                    {name: '宜居', value: 335},
                    {name: '不宜居', value: 310},
                ];
                let description = '';
                return (
                  <div style={{height:"500"}}>
                    <Layout>
                        <PieChart title={title} dataName={dataName} chartData={chartData} description={description}/>
                    </Layout>
                  </div>
                );
            case 2:
                // 第二页的图表组件
                return (
                    <div style={{height:"500"}}>
                        {<Gauge></Gauge>}
                    </div>
                );
            case 3:
                // 第三页的图表组件
                return (
                    <div style={{height:"500"}}>
                        {<LineChart></LineChart>}
                    </div>
                );
            // 添加更多页面的图表组件
            default:
                return null;
        }
    };

    const totalPages = 3; // 总页数，根据实际需求设置

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