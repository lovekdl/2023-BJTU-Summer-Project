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




    const handlePageChange = (page:any) => {
        setCurrentPage(page);
    };

    const renderChartComponent = (pageNumber:any) => {
        switch (pageNumber) {
            case 1:
                let title1 = '宜居度比例';
                let subtitle1 = '';
                let dataName1 = '宜居度';
                let chartData1 = [
                    {name: '宜居', value: 64},
                    {name: '不宜居', value: 3752},
                ];
                let description1 = (
                    <div>
                    <span>
                        3816条数据中，共有64个星球是宜居的，<br />
                        其余的3752个星球均不适合人类生存。
                    </span>
                    <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div style={{fontSize: '40px'}}><b>珍惜我们唯一的家园。</b></div>
                    </div>
                );
                return (
                    <Layout>
                        <PieChart title={title1} subtitle={subtitle1} dataName={dataName1} chartData={chartData1} description={description1}/>
                    </Layout>
                );
            case 2:
                // 第二页的图表组件
                let title2 = '宜居与不宜居星球的ESI分布';
                let dataName2 = 'ESI';
                let subtitle2 = 'ESI:地球相似度 低: 0-0.5 中: 0.5-0.8 高: 0.8-1.0'
                let chartData2 = [
                    {name: '高ESI宜居星球', value: 14},
                    {name: '高ESI不宜居星球', value: 11},
                    {name: '中ESI不宜居星球', value: 198},
                    {name: '中ESI宜居星球', value: 48},
                    {name: '低ESI不宜居星球', value: 3543},
                    {name: '低ESI宜居星球', value: 2},
                ];
                let description2 = (
                    <div>
                    <span>
                        中高相似度(ESI{'>'}0.5)的行星中，宜居星球占比较高;<br />
                        而低相似度(ESI{'<'}0.5)的行星中，不宜居星球占比较高。<br />
                    </span>
                        <br/>
                        <br/>
                        <div style={{fontSize: '40px'}}><b>
                            但高ESI不代表一定宜居，<br />
                            还存在着液态行星等情况。</b></div>
                    </div>
                );
                return (
                    <Layout>
                        <PieChart title={title2} subtitle={subtitle2} dataName={dataName2} chartData={chartData2} description={description2}/>
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

    const totalPages = 10; // 总页数，根据实际需求设置

    return (
        <div className='PageContainer'>
            {renderChartComponent(currentPage)}
            <Pagination
                current={currentPage}
                total={totalPages}
                pageSize={pageSize}
                onChange={handlePageChange}
                className="LeftMargin30"
            />
        </div>
    );
};

export default AnalysisPage;
