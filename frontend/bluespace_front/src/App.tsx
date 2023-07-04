// Photos from https://citizenofnowhe.re
import "./App.css";
import { useState,useEffect } from "react";
import { useAnimate, stagger,motion } from "framer-motion";
import { ButtonAppBar, Menu, MenuToggle} from './menu/index'


const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;



function Image({ id }: { id: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  return (
    <section>
      {'page: ' + id}
      <motion.div
        initial={false}
        animate={
          isLoaded && isInView
            ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
            : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
        }
        transition={{ duration: 1, delay: 1 }}
        viewport={{ once: true }}
        onViewportEnter={() => setIsInView(true)}
      >
        
        <img src={`/${id}.jpg`} alt="" onLoad={() => setIsLoaded(true)} />
      </motion.div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <ButtonAppBar className="menu2"></ButtonAppBar>
       {[1, 2].map((image) => (
        <Image id={image} />
      ))}

      {/* <nav className="menu">
        <ul>
          <li>Portfolio</li>
          <li>About</li>
          <li>Contact</li>
          <li>Search</li>
        </ul>
      </nav> */}
      
    </>
  );
}
