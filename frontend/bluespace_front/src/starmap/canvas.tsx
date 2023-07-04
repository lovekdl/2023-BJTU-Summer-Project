import { useEffect } from "react"
import { BlueSpaceRenderer } from "./renderer"


function StarMap() {

  let renderer: BlueSpaceRenderer
  try {
    renderer = new BlueSpaceRenderer()
    renderer.setup()
  } catch (error) {
    throw new Error("Intializing renderer failed: " + error)
  }

  return (
    <div>
      <canvas></canvas>
    </div>
  )
}

// function StarMap() {

//   useEffect(() => {
//     const script = document.createElement("script")

//     script.src = "/src/starmap/renderer.ts"
//     script.async = true
//     script.type = "module"

//     const canvas = document.createElement("canvas")
    
//     document.body.appendChild(script)
//     document.body.appendChild(canvas)

//     return () => {
//       document.body.removeChild(script)
//       document.body.removeChild(canvas)
//     }
//   }, [])

//   return <div className="StarMap"></div>
// }

export default StarMap
