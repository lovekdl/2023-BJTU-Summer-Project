import { useEffect } from "react"
import {useStore} from "../store/index"
import "./starmap.style.css"
import { observer } from 'mobx-react-lite';

import Lottie from 'react-lottie';
import animationData from '../StarMapLoading.json';
import {init} from'./src/starmap'

function StarMap() {
  const {LoadingStore,StarMapStore} = useStore()

  //加载动画设置
  const defaultOptions = {
    loop: true, // 是否循环播放
    autoplay: true, // 是否自动播放
    
    animationData: animationData, // 导入的动画数据
    rendererSettings: {
      scale:0.1,
      preserveAspectRatio: 'xMidYMid slice' // 渲染设置
    }
  };

  useEffect(() => {
    // const script = document.createElement("script")
    const canvas = document.createElement("canvas")
    // script.src = "/src/starmap/src/starmap.ts"
    // script.async = true
    // script.type = "module"
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    // document.getElementById("StarMap")?.appendChild(script)
    document.getElementById("StarMap")?.appendChild(canvas)
    init()
    return () => {
      // document.getElementById("StarMap")?.removeChild(script)
      document.getElementById("StarMap")?.removeChild(canvas)
    }
  }, [])

  return (<div>
    
    <div className="StarMap">
      {LoadingStore.starMapLoading && 
        <div className = 'StarMapLoading'>
          <Lottie options={defaultOptions} />
        </div>
      }
      
      <div id="StarMap" style={{ visibility: !LoadingStore.starMapLoading ? 'visible' : 'hidden' }}>
        <div className = 'StarMapMessage' style={{ visibility: StarMapStore.show? 'visible' : 'hidden' }}>
          <div className="SolidOpacity" >
            <h1>{StarMapStore.header}</h1>
            <div>
              {StarMapStore.message.map((item,index) => {
                return (
                <div key = {index} className="NormalFont" style={{margin:'10px'}}>
                  {item}
                  <br></br>
                </div>)
              })}
            </div>
          </div>
        </div>
      </div> 
      
    </div>
    </div>
    )
}

export default observer(StarMap)
