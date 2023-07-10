import { Table } from "antd"
import {useStore} from "../store/index"

export default function ProfilePlanets() {

  const {ProfileStore} = useStore()

  return (
    <div>
      <h3>Likes</h3>
      <div>
        <Table className="TableDiv" columns={ProfileStore.likesColumns}  dataSource={ProfileStore.likesDataSource}></Table>
      </div>
    </div>
  )
}