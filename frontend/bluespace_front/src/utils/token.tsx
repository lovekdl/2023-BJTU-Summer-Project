//封装，localstorage存储token

const key = 'scarletmana-cookie-token'
const langKey = 'BlueSpace-language-key'
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



export {
  setTokenFromLocalStorage,
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  setLanguageFromLocalStorage,
  getLanguageFromLocalStorage,
}