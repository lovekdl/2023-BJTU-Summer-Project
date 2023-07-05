import { useState,useEffect } from "react";
import { useAnimate, stagger,motion } from "framer-motion";
 import { StarMap } from "../starmap/index";
import "./main.style.css";
const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;



function MainComponent({ id }: { id: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  return (
    <div>
      <div className="placeholder"></div>
      <div className="good">
        {id === 1 ? (
          <section className="innerSection">
          <StarMap></StarMap> 
          </section>
        ) : (
          <section className="innerSection">
            {'page: ' + id}
            
          </section>
        )}
      </div>
      <div className="placeholder"></div>
    </div>
  );
}
export default MainComponent