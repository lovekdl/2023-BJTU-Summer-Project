import "./menu.css";
import { useState, useEffect } from "react";
import { useAnimate, stagger, motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

function useMenuAnimation(isOpen: boolean) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(".arrow", { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });
    
    animate(
      "ul",
      {
        clipPath: isOpen
          ? "inset(0% 0% 0% 0% round 10px)"
          : "inset(10% 50% 90% 50% round 10px)"
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.5
      }
    );

    animate(
      "li",
      isOpen
        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
      {
        duration: 0.2,
        delay: isOpen ? staggerMenuItems : 0
      }
    );
  }, [isOpen]);

  return scope;
}

export default function MenuScroll() {
  const [isOpen, setIsOpen] = useState(false);
  const scope = useMenuAnimation(isOpen);
  const navigate = useNavigate()
  const handleOnClicked = (x:number)=> {
    if(x == 1) {
      navigate("/",{replace : false})
    }
    if(x == 2) {
      navigate("/prediction",{replace : false})
    }
  }
  return (
    <nav className="menuScroll" ref={scope}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className = 'MenuButton'
      >
        
        <div className="arrow" style={{ transformOrigin: "50% 55%" }}>
          <svg width="15" height="15" viewBox="0 0 20 20" >
            <path fill="#FFFFFF" d="M0 7 L 20 7 L 10 16" style={{color:"white"}}/>
          </svg>
        </div>
      </motion.button>
      
      <div className = 'subMenu'>
        <ul
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            clipPath: "inset(10% 50% 90% 50% r  ound 10px)"
          }}
          className="ul1"
        >
          <li className="li1" onClick={() => handleOnClicked(1)}>Star Map</li>
          <li className="li1" onClick={() => handleOnClicked(2)}>Prediction</li>
        </ul>{" "}
      </div>
    </nav>
  );
}
