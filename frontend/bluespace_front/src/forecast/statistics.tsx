import {Table} from 'antd'
import { useStore } from '../store/index'

export default function Statistics() {
  const {PredictionStore} = useStore()
  return (
    <div className='ContentLayout'>
      <Table className="TableDiv" columns={PredictionStore.Columns}  dataSource={PredictionStore.DataSource}></Table>
    </div>
  )
} 