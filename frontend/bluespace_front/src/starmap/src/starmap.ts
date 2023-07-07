import { BlueSpaceRenderer } from "./renderer"

// ===== Start Renderer =====

let renderer: BlueSpaceRenderer
try {
    renderer = new BlueSpaceRenderer()
    renderer.setup().then(() => {
        renderer.run()
    })
} catch (error) {
    throw new Error("Intializing renderer failed: " + error)
}

// ===== Mouse Listener =====

const starmapElement = document.getElementById("StarMap")
let isMouseMiddleDown: boolean = false
let last = {x: 0, y: 0}

// Mouse Down
starmapElement!.addEventListener("mousedown", (e) => {
    if(e.which === 1) {
        console.clear()
        console.log("ratio: " + window.devicePixelRatio)
        console.log("x: " + e.offsetX + ", " + renderer.canvasSize.width / window.devicePixelRatio)
        console.log("y: " + e.offsetY + ", " + renderer.canvasSize.height / window.devicePixelRatio)
        const cx = e.offsetX / renderer.canvasSize.width * window.devicePixelRatio
        const cy = e.offsetY / renderer.canvasSize.height * window.devicePixelRatio
        const planetId = renderer.selectPlanet(cx, cy)
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
    if((e as WheelEvent).deltaY > 0) {
        renderer.camera.zoom(1)
    } else if((e as WheelEvent).deltaY < 0) {
        renderer.camera.zoom(-1)
    }
})

// ===== Keyboard Listener =====

// Key Down
document.addEventListener("keydown", e => {
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