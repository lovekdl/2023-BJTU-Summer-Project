import { useState,useEffect } from "react";
import { useAnimate, stagger,motion } from "framer-motion";
 import { StarMap } from "../starmap/index";
import "./main.style.css";
const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;



function MainComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const handleWheel = (e:any) => {
      e.preventDefault();
    };

    // 在组件挂载时添加滚轮事件监听器
    window.addEventListener('wheel', handleWheel, { passive: false });

    // 在组件卸载时移除滚轮事件监听器
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  return (
    <div>
      
      <div className="good">
          <StarMap></StarMap>
          aa 
      </div>
    </div>
  );
}
export default MainComponent