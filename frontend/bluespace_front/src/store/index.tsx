/*
	存储模块
	用于状态管理和响应式更新
*/
import LoginStore from "./login.store"
import ProfileStore from "./profile.store"
import LoadingStore from "./loading.store"
import PredictionStore from "./prediction.store"
import StarMapStore from "./starmap.store"
import StatisticsStore from "./statistics.store"
import React from "react"
class RootStore {
  loginStore: LoginStore 
	ProfileStore: ProfileStore
	LoadingStore : LoadingStore
	PredictionStore : PredictionStore
	StarMapStore:StarMapStore
	StatisticsStore:StatisticsStore
	constructor() {
		this.loginStore = new LoginStore()
		this.ProfileStore = new ProfileStore()
		this.LoadingStore = new LoadingStore()
		this.PredictionStore = new PredictionStore()
		this.StarMapStore = new StarMapStore()
		this.StatisticsStore = new StatisticsStore()
	}
}

const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export {useStore, rootStore}