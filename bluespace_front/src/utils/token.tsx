//封装，localstorage存储token

const key = 'scarletmana-cookie-token'

const setTokenFromLocalStorage = (token:string) => {
  return window.localStorage.setItem(key, token)
}

const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem(key);
}

const removeTokenFromLocalStorage = () => {
  return window.localStorage.removeItem(key);
}

export {
  setTokenFromLocalStorage,
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage
}