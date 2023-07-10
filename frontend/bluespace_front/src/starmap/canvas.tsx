import { useEffect } from "react"
import {useStore} from "../store/index"
import "./starmap.style.css"
import { observer } from 'mobx-react-lite';

import Lottie from 'react-lottie';
import animationData from '../StarMapLoading.json';

function StarMap() {
  const {LoadingStore} = useStore()
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
    const script = document.createElement("script")

    script.src = "/src/starmap/renderer.ts"
    script.async = true
    script.type = "module"

    const canvas = document.createElement("canvas")
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'


    document.getElementById("StarMap")?.appendChild(script)
    document.getElementById("StarMap")?.appendChild(canvas)

    return () => {
      document.getElementById("StarMap")?.removeChild(script)
      document.getElementById("StarMap")?.removeChild(canvas)
    }
  }, [])

  return (
    
    <div className="StarMap">
      {LoadingStore.starMapLoading && 
        <div className = 'StarMapLoading'>
          <Lottie options={defaultOptions} />
        </div>
      }
      
      <div id="StarMap" style={{ visibility: !LoadingStore.starMapLoading ? 'visible' : 'hidden' }}>
      </div>
    </div>
    )
}

export default observer(StarMap)
