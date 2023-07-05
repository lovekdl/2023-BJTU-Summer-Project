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
          <section>
          <StarMap></StarMap>
          </section>
        ) : (
          <section>
            {'page: ' + id}
            <motion.div
              initial={false}
              animate={
                isLoaded && isInView
                  ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                  : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
              }
              transition = {{ duration: 1, delay: 1 }}
              viewport = {{ once: true }}
              onViewportEnter = {() => setIsInView(true)}
            >
              <img src = {`/${id}.jpg`} alt = "" onLoad = {() => setIsLoaded(true)} />
            </motion.div>
          </section>
        )}
      </div>
      <div className="placeholder"></div>
    </div>
  );
}
export default MainComponent