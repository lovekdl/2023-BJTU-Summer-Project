import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class StarMapStore {
	header = 'aa';
  message = ['bb','accc'];
  show = false

  goPlanet = false;
  planetFeatures = {
    Planet_name:"test_planet",
    Orbit_period:'1',
    Semi_major_axis:'1',
    Mass:'1',
    Radius:'1',
    Stellar_luminosity:'0',
    Stellar_mass:'1',
    Stellar_radius:'0',
    esi:'0.5',
    habitable: 'NOT Habitable',
  }

	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
	}
  setHeader(newHeader:string) {
    this.header = newHeader
  }
  push(newMessage : string) {
    this.message.push(newMessage);
  }
  setMessage(newMessages:any) {
    this.message = newMessages
  }
	setShow(newShow :boolean) {
    this.show = newShow
  }
  setGoPlanet(x : boolean) {
    this.goPlanet = x;
  }
  setPlanetFeatures(newFeatures:any) {
    this.planetFeatures = newFeatures
  }
}

export default StarMapStore