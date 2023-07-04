import { useEffect } from "react"

function StarMap() {

  useEffect(() => {
    const script = document.createElement("script")

    script.src = "/src/starmap/renderer.ts"
    script.async = true
    script.type = "module"

    const canvas = document.createElement("canvas")
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    
    document.getElementById("StarMap")?.appendChild(script)
    document.getElementById("StarMap")?.appendChild(canvas)

    return () => {
      document.getElementById("StarMap")?.removeChild(script)
      document.getElementById("StarMap")?.removeChild(canvas)
    }
  }, [])

  return <div className="StarMap" id="StarMap"></div>
}

export default StarMap
