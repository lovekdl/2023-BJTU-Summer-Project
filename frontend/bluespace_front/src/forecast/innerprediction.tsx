
import * as React from "react";
import { RefObject,useState,useRef } from "react";
import { Reorder } from "framer-motion";
import { observer } from 'mobx-react-lite';
import { motion } from "framer-motion";
import { Item } from "./Item";
import {useStore} from "../store/index"
import {message} from "antd"



function InnerPrediction() {
  const [count, setCount] = useState(0);
  const {PredictionStore} = useStore();
  const Planet_name = useRef<HTMLInputElement>(null);
  const Orbit_period = useRef<HTMLInputElement>(null);
  const Semi_major_axis = useRef<HTMLInputElement>(null);
  const Mass = useRef<HTMLInputElement>(null);
  const Radius = useRef<HTMLInputElement>(null);
  const Stellar_luminosity = useRef<HTMLInputElement>(null);
  const Stellar_mass = useRef<HTMLInputElement>(null);
  const Stellar_radius = useRef<HTMLInputElement>(null);
  const handleAddClicked = () => {
    console.log('aa')
    PredictionStore.addItem("newItem" + count)
    setCount(count + 1);
  }
  const handlePredictClicked = () => {
    console.log(Planet_name.current?.value)
    for(const element of PredictionStore.items) {
      if(element.name == Planet_name.current?.value) {
        message.error('Repeated name')
        return;
      }
    }
    PredictionStore.addItem({name:Planet_name.current?.value,habitable:false,esi:0.5})
  }
  return (
    <div className="InnerPredictionContent"> 
      <div className = 'PredictInputContent'>
        <div className="input-items">
          <span className="input-tips">
              Planet name
          </span>
          <br></br>
          <input type="text" className="predictinputs" placeholder="Enter Planet name" ref = {Planet_name} />
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            Orbital Period[days]
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Orbital Period[days]" ref = {Orbit_period} />
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            Orbit Semi-Major Axis
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Orbit Semi-Major Axis" ref = {Semi_major_axis}/>
          
        </div>
        
        <div className="input-items">
          <span className="input-tips">
            Planet Mass
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Planet Mass" ref = {Mass} />
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            Planet Radius
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Planet Radius" ref={Radius}/>
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            Stellar Luminosity
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Stellar Luminosity" ref = {Stellar_luminosity}/>
          
        </div>
        <div className="input-items">
          <span className="input-tips">
            Stellar Mass
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Stellar Mass" ref = {Stellar_mass}/>
        </div>
        <div className="input-items">
          <span className="input-tips">
            Stellar Radius
          </span>
          <br></br>
          <input type="number" className="predictinputs" placeholder="Enter Stellar Radius" ref = {Stellar_radius}/>
        </div>
      </div>
      <div className="MiddleButtonContent">
        <motion.button
          className="box" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handlePredictClicked}
          type = 'submit'
        >
          Predict →
        </motion.button>
      </div>

      <div className='ReorderContent'>
        <Reorder.Group  axis="y" onReorder={PredictionStore.setItems} values={PredictionStore.items}>
        {PredictionStore.items.map((item) => (
          <Item key={item.name} item={item} />
        ))}
        </Reorder.Group>
        {/* <button onClick={handleAddClicked}> add </button> */}
      </div>
      
    </div>
  )
}

export default observer(InnerPrediction)