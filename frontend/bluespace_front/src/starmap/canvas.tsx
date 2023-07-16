import { useEffect ,useState} from "react"
import {useStore} from "../store/index"
import "./starmap.style.css"
import { observer } from 'mobx-react-lite';
import { BlueSpaceRenderer } from "./src/renderer"
import Lottie from 'react-lottie';
import animationData from '../StarMapLoading.json';
import {init} from'./src/starmap'
import {Modal} from 'antd'
import { getFirstMessageKeyFromLocalStorage,setFirstMessageKeyFromLocalStorage } from "../utils";
import '../index.tsx';
import {useTranslation} from 'react-i18next'
function StarMap() {
  const {LoadingStore,StarMapStore} = useStore()
  let renderer: BlueSpaceRenderer
  const {t,i18n} = useTranslation()
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
    renderer = init()
    console.log('aaa' + getFirstMessageKeyFromLocalStorage())
    if((!getFirstMessageKeyFromLocalStorage() || (getFirstMessageKeyFromLocalStorage()==='YES')) && StarMapStore.goPlanet == false) {
      var check_interval = setInterval(() => {
        if(renderer.getHaveRun() == true) {
          setTimeout(()=>setIsModalOpen(true),2000);
          clearInterval(check_interval);
        }
      }, 200)
    }
    return () => {
      // document.getElementById("StarMap")?.removeChild(script)
      renderer.stop()
      StarMapStore.setGoPlanet(false)
      document.getElementById("StarMap")?.removeChild(canvas)
    }
  }, [])
  const handleOnClick = () => {
    
    renderer.stop()
  }
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFirstMessageKeyFromLocalStorage('NO');
  };
  return (<div>
    
    <div className="StarMap">
      {LoadingStore.starMapLoading && 
        <div className = 'StarMapLoading'>
          <Lottie options={defaultOptions} />
        </div>
      }
      
      <div id="StarMap" style={{ visibility: !LoadingStore.starMapLoading ? 'visible' : 'hidden' }}>
        <Modal title= {t("Welcome to Exoplanet habitability analysis System")} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText = {t('No prompt next time')} okText={t('ok')} maskClosable={false} width={900} closable={false}>
          <h3>{t('Production team')}</h3>
          <p>{t('Blue Space team')}</p>
          <h3>{t('Introduction')}</h3>
          <p>{t('Introduction message1')}</p>
          <p>{t('Introduction message2')}</p>
          <p>{t('Introduction message3')}</p>
          <h3>{t('Operation Introduction')}</h3>
          <p>{t('Introduction message4')}</p>
          <p>{t('Introduction message5')}</p>
          <p>{t('Introduction message6')}</p>
          <p>{t('Introduction message7')}</p>
        </Modal>
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
