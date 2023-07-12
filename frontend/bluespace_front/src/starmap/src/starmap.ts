import { BlueSpaceRenderer } from "./renderer"
import { rootStore } from '../../store/index' // add by lovekdl
import { PlanetsDataLoader  } from "./planetsDataLoader";

// ===== Start Renderer =====

let renderer: BlueSpaceRenderer
try {
    rootStore.LoadingStore.setStarMapLoading(true);
    rootStore.StarMapStore.setShow(false)
    
    renderer = new BlueSpaceRenderer()
    renderer.setup().then(() => {
        renderer.run()
    })  
    
    let checkHaveRunInterval = setInterval(() => {
        console.log("haveRun = " +  renderer.getHaveRun())
        if(renderer.getHaveRun() === true) {
            setTimeout(() => {
                rootStore.LoadingStore.setStarMapLoading(false);
            }, 1000)
            clearInterval(checkHaveRunInterval)
        }
    },100)
} catch (error) {
    throw new Error("Intializing renderer failed: " + error)
}

// ===== Mouse Listener =====

const starmapElement = document.getElementById("StarMap")
let isMouseMiddleDown: boolean = false
let last = {x: 0, y: 0}

// Mouse Down
let renderMode: number = 0
starmapElement!.addEventListener("mousedown", (e) => {
    if(e.which === 1) {
        console.log("renderMode: " + renderMode)
        if(renderMode === 0) {
            renderMode = -1
            const cx = e.offsetX / renderer.getCanvasSize().width * window.devicePixelRatio
            const cy = e.offsetY / renderer.getCanvasSize().height * window.devicePixelRatio
            const {planetId, dataId} = renderer.selectPlanet(cx, cy)
            console.log("Clicked: Planet " + planetId)
            if(planetId != -1) {
                renderer.switchMode(1, planetId).then(() => {
                    renderMode = 1
                })
                console.log(dataId)
                console.log(PlanetsDataLoader.getInstance().query(dataId))
                rootStore.StarMapStore.setHeader("Header")
                rootStore.StarMapStore.setMessage(["Content1", "Content2"])
                rootStore.StarMapStore.setShow(true)
            } else {
                renderMode = 0
            }
        } else if(renderMode === 1) {
            renderMode = -1
            renderer.switchMode(0).then(() => {
                renderMode = 0
            })
            rootStore.StarMapStore.setShow(false)
        }
    } else if(e.which === 2) {
        isMouseMiddleDown = true
        last.x = e.clientX
        last.y = e.clientY
    }
})

// Mouse Move
starmapElement!.addEventListener("mousemove", (e) => {
    if(isMouseMiddleDown && e.which === 2) {
        // console.log("middle drag delta: " + (e.clientX - last.x) + ", " + (e.clientY - last.y))
        renderer.camera.rotateHorizontal(e.clientX - last.x)
        renderer.camera.rotateVertical(-(e.clientY - last.y))
        last.x = e.clientX
        last.y = e.clientY
    }
})

// Mouse Up
starmapElement!.addEventListener("mouseup", (e) => {
    if(e.which === 2) {
        isMouseMiddleDown = false
    }
})

// Mouse Wheel
starmapElement!.addEventListener("mousewheel", (e) => {
    if(renderMode === 1) return;
    if((e as WheelEvent).deltaY > 0) {
        renderer.camera.zoom(1)
    } else if((e as WheelEvent).deltaY < 0) {
        renderer.camera.zoom(-1)
    }
})

// ===== Keyboard Listener =====

// Key Down
document.addEventListener("keydown", e => {
    if(renderMode === 1) return;
    if(e.code === "KeyW") {
        renderer.camera.buttonPressed.W = true
    }
	if(e.code === "KeyS") {
        renderer.camera.buttonPressed.S = true
    }
	if(e.code === "KeyA") {
        renderer.camera.buttonPressed.A = true
    }
	if(e.code === "KeyD") {
        renderer.camera.buttonPressed.D = true
    }
	if(e.code === "Space") {
        // renderer.camera.buttonPressed.Space = true
    }
	if(e.code === "ControlLeft") {
        // renderer.camera.buttonPressed.ControlLeft = true
    }
})

// Key Up
document.addEventListener("keyup", e => {
    if(e.code === "KeyW") {
        renderer.camera.buttonPressed.W = false
    }
	if(e.code === "KeyS") {
        renderer.camera.buttonPressed.S = false
    }
	if(e.code === "KeyA") {
        renderer.camera.buttonPressed.A = false
    }
	if(e.code === "KeyD") {
        renderer.camera.buttonPressed.D = false
    }
	if(e.code === "Space") {
        renderer.camera.buttonPressed.Space = false
    }
	if(e.code === "ControlLeft") {
        renderer.camera.buttonPressed.ControlLeft = false
    }
})

// Disable Right Click Menu
window.oncontextmenu = function () {
    return false;     // cancel default menu
}
