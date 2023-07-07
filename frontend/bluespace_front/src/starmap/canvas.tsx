import { useEffect } from "react"
import "./starmap.style.css"
function StarMap() {

  useEffect(() => {
    const script = document.createElement("script")

    script.src = "/src/starmap/renderer.ts"
    script.async = true
    script.type = "module"

    const canvas = document.createElement("canvas")
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'


    document.getElementById("StarMap")?.appendChild(script)
    document.getElementById("StarMap")?.appendChild(canvas)

    return () => {
      document.getElementById("StarMap")?.removeChild(script)
      document.getElementById("StarMap")?.removeChild(canvas)
    }
  }, [])

  return <div className="StarMap"><div id="StarMap"></div></div>
}

export default StarMap
