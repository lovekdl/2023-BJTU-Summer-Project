import Gauge from "../dataanalysis/Gauge";
import BarGraph from "../dataanalysis/BarGraph";
import PieChart from "../dataanalysis/PieChart";
import LineChart from "../dataanalysis/LineChart";
import React, { useState } from 'react';
import {Layout, message, Pagination} from 'antd';
import {http} from "../utils";
const { Content, Sider } = Layout;
const AnalysisPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 1; // 每页显示的图表组件数量




    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderChartComponent = (pageNumber) => {
        switch (pageNumber) {
            case 1:
                let title = '宜居度比例';
                let dataName = '宜居度';
                let chartData = [
                    {name: '宜居', value: 335},
                    {name: '不宜居', value: 310},
                ];
                let description = '这是关于图表的说明文本';
                return (
                    <Layout>
                        <PieChart title={title} dataName={dataName} chartData={chartData} description={description}/>
                    </Layout>
                );
            case 2:
                // 第二页的图表组件
                return (
                    <Layout>
                        {<Gauge></Gauge>}
                    </Layout>
                );
            case 3:
                // 第三页的图表组件
                return (
                    <Layout>
                        {<LineChart></LineChart>}
                    </Layout>
                );
            // 添加更多页面的图表组件
            default:
                return null;
        }
    };

    const totalPages = 3; // 总页数，根据实际需求设置

    return (
        <div className='PageContainer'>
            {renderChartComponent(currentPage)}
            <Pagination
                current={currentPage}
                total={totalPages}
                pageSize={pageSize}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default AnalysisPage;
