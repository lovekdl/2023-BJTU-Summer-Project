import { useEffect } from "react"
import { Helmet } from "react-helmet"

function StarMap() {

  useEffect(() => {
    const script = document.createElement("script")

    script.src = "/src/starmap/starMap.ts"
    script.async = true
    script.type = "module"

    const canvas = document.createElement("canvas")
    
    document.body.appendChild(script)
    document.body.appendChild(canvas)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return <div className="StarMap"></div>
}

export default StarMap
