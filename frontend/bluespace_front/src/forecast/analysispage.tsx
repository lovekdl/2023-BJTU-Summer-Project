import Gauge from "../dataanalysis/Gauge";
import BarGraph from "../dataanalysis/BarGraph";
import PieChart from "../dataanalysis/PieChart";
import LineChart from "../dataanalysis/LineChart";
import React, { useState } from 'react';
import {Layout, message, Pagination} from 'antd';
import {http} from "../utils";
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

                let title3 = "星球的半径分布";
                let dataName3 = ["0-0.4", "0.4-0.8", "0.8-1.2", "1.2-1.6", "1.6-2.0", "2.0-2.4", "2.4-2.8",'2.8-3.2', '>3.2'];
                let chartData31 = [0, 1, 17, 9, 15, 15, 7, 2, 0];
                let chartData32 = [1, 68, 314, 558, 472, 482, 450, 305, 1103];
                let description3 = (
                    <div>
                    <span>
                    宜居星球的半径与地球相近，<br />
                    而不宜居星球则以地球三倍以上半径者居多。
                    </span>
                        <br/>
                        <br/>
                        <div style={{fontSize: '40px'}}><b>
                            星球半径过大则大概率不宜居。</b></div>
                    </div>
                );
                //不宜居的数据：1, 68, 314, 558, 472, 482, 450, 305
                return (
                    <Layout>
                        <BarGraph title={title3} dataName={dataName3} chartData1={chartData31} chartData2={chartData32} description={description3}/>
                    </Layout>
                );

            case 4:
                let title4 = "星球的质量分布";
                let dataName4 = ["0-0.8", "0.8-1.2", "1.2-2.0", "2.0-4.0", "4.0-8.0", ">8.0"];
                let chartData41 = [2, 8, 8, 15, 25, 8];
                let chartData42 = [149, 66, 194, 756, 1012, 1557];
                let description4 = (
                    <div>
                    <span>
                    宜居星球的质量分布较为均匀，不宜居星球则以较大质量为主。
                    </span>
                        <br/>
                        <br/>
                        <div style={{fontSize: '40px'}}><b>
                            质量大往往意味着更大的引力，保有大气层能力 <br />
                            更强的同时，也为生存带来了更大的压力。</b></div>
                    </div>
                );
                return (
                    <Layout>
                        <BarGraph title={title4} dataName={dataName4} chartData1={chartData41} chartData2={chartData42} description={description4}/>
                    </Layout>
                );
            case 5:
                let title5 = "所在星系恒星温度分布";
                let dataName5 = ["2500-3000", "3000-3500", "3500-4000", "4000-4500", "4500-5000", "5000-5500", '5500-6000', '>6000'];
                let chartData51 = [11, 21, 11, 5, 9, 3, 3, 0];
                let chartData52 = [9, 91, 170, 193, 377, 753, 1347, 812];
                let description5 = (
                    <div>
                    <span>
                        宜居行星所在星系温度偏低({'<5000'})，不宜居的偏高({'>5000'})。 <br />
                        显然温度过高不适宜人类生存。
                    </span>
                        <br/>
                        <br/>
                        <div style={{fontSize: '40px'}}><b>
                            地球已经够热了。 </b></div>
                    </div>
                );
                return (
                    <Layout>
                        <BarGraph title={title5} dataName={dataName5} chartData1={chartData51} chartData2={chartData52} description={description5}/>
                    </Layout>
                );
            default:
                return null;
        }
    };

    const totalPages = 5; // 总页数，根据实际需求设置

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
