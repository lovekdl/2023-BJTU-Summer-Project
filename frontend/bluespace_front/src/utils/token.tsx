//封装，localstorage存储token

const key = 'BlueSpace-cookie-token'
const langKey = 'BlueSpace-language-key'
const firtMessageKey = 'BlueSpace-First-Message'
const setTokenFromLocalStorage = (token:string) => {
  return window.localStorage.setItem(key, token)
}

const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem(key);
}

const removeTokenFromLocalStorage = () => {
  return window.localStorage.removeItem(key);
}

const setLanguageFromLocalStorage = (language:string) => {
  return window.localStorage.setItem(langKey, language)
}

const getLanguageFromLocalStorage = () => {
  return window.localStorage.getItem(langKey);
}


const setFirstMessageKeyFromLocalStorage = (x:string) => {
  return window.localStorage.setItem(firtMessageKey, x)
}

const getFirstMessageKeyFromLocalStorage = () => {
  return window.localStorage.getItem(firtMessageKey);
}


export {
  setTokenFromLocalStorage,
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  setLanguageFromLocalStorage,
  getLanguageFromLocalStorage,
  setFirstMessageKeyFromLocalStorage,
  getFirstMessageKeyFromLocalStorage,
  
}