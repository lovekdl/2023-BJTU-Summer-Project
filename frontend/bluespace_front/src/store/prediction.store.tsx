

import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'
import { List } from 'echarts';
import i18n from '../index.tsx';
class PredictionStore {
	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
		
	}
	DataSource = [
		{
			key: '1',
			Planet_name: "erth",
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '2',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '3',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '4',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '5',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		
	];
	
	
	
  items = [{name:"11111",esi:0.24,habitable:false}, {name:"222222",esi:0.9,habitable:true}, {name:"333333",esi:0.88,habitable:false}, {name:"4444444",esi:0.27,habitable:true}];

  starMapLoading:boolean = true

	
	setStarMapLoading = (x : boolean) => {
    this.starMapLoading = x
  }
  addItem = (newItem : any)=> {
    this.items.push(newItem);
  }
  setItems = (newItems : any)=> {
    this.items = newItems
  }
}

export default PredictionStore