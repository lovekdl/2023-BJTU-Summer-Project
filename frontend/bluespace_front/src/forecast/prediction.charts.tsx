import LineChart from "../dataanalysis/LineChart"
import Gauge from "../dataanalysis/Gauge"
import PieChart from "../dataanalysis/PieChart";
import {Layout, message, Pagination} from 'antd';
import { useState } from "react";
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import {useStore} from '../store/index.tsx'
import { observer } from 'mobx-react-lite';
 function PredictionChart() {
    const {t,i18n} = useTranslation()
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 1; // 每页显示的图表组件数量
    const {PredictionStore} = useStore()



    const handlePageChange = (page:any) => {
        setCurrentPage(page);
    };

    const renderChartComponent = (pageNumber:any) => {
        switch (pageNumber) {
            case 1:
                let title1 = t('Predicted habitability of the planet')
                let dataName1 = t('Habitability')
                let chartData1 = PredictionStore.showEsi
                return (
                    <div style={{height:"500"}}>
                        {<Gauge title={title1} dataName={dataName1} chartData={chartData1} />}
                    </div>
                );
            case 2:
                // 第二页的图表组件
                let title2 = t("The planet's data are compared to Earth's")
                let dataName2 = '随便填什么都可以'
                let chartData2 = PredictionStore.showData
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
}export default observer(PredictionChart)