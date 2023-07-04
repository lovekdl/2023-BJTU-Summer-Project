import vertexShaderRaw from "../shaders/myShader.vert.wgsl?raw"
import fragmentShaderRaw from "../shaders/myShader.frag.wgsl?raw"
import * as sphere from "../util/sphere"
import { mat4, vec3 } from 'gl-matrix'

/**
 * 蓝色空间渲染器
 * 
 * 渲染星图
 * 
 * 由于渲染器需要异步初始化，所以必须按照如下方法进行实例化
 *   let renderer: BlueSpaceRenderer
 *   try {
 *     renderer = new BlueSpaceRenderer()
 *     await renderer.setup()
 *   } catch (error) {
 *     console.log("Error: ", error)
 *   }
 * 具体详见：https://stackoverflow.com/questions/35743426/async-constructor-functions-in-typescript
 */
class BlueSpaceRenderer {
    // about renderer
    private haveSetup: boolean = false
    private device: GPUDevice | null = null
    private context: GPUCanvasContext | null = null
    private format: GPUTextureFormat | null = null
    private canvasSize: {width: number, height: number} = {width: 0, height: 0}

    constructor() {}

    async setup() {
        await this.initWebGPU()
        await this.initPipeline()

        // 初始化完毕
        this.haveSetup = true
    }

    async initWebGPU() {
        // canvas
        const canvas = document.querySelector('canvas')
        if(!canvas) {
            throw new Error("Can't find canvas in page.")
        }
        // webgpu
        if(!navigator.gpu) {
            throw new Error("Not support WebGPU.")
        }
        // adapter
        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance' // 默认设置高性能模式
        })
        if(!adapter) {
            throw new Error("Adapter is null.")
        }
        // device
        const device = await adapter.requestDevice({
            requiredFeatures: [],
            requiredLimits: {
                maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
            }
        })
        // context
        const context = canvas.getContext('webgpu') as GPUCanvasContext
        // format
        const format = navigator.gpu.getPreferredCanvasFormat()
        // canvasSize
        canvas.width = canvas.clientWidth * window.devicePixelRatio
        canvas.height = canvas.clientHeight * window.devicePixelRatio
        context.configure({
            device,
            format,
        })
        
        // this
        this.device = device
        this.context = context
        this.format = format
        this.canvasSize = {width: canvas.width, height: canvas.height}
    }

    // 想在管线中传入数据，需要有以下这几步
    // 1. 定义数据
    // 1.1 定义TypedArray
    // 1.2 定义Buffer (size, usage)
    // 1.3 写入Buffer (device.queue.writeBuffer)
    // 2. 修改Pipeline
    // 2.1 修改Pipeline的属性，设置解析方式
    // 3. 在draw时进行使用
    // 3.1 传入对应location (setVertexBuffer)
    // 3.2 在draw时指定绘制的顶点个数
    async initPipeline() {
        // pipeline
    }
}

async function initPipeline(device: GPUDevice, format: GPUTextureFormat, size: {width: number, height: number}) {
    // ===== Pipeline =====
    const descriptor: GPURenderPipelineDescriptor = {
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: vertexShaderRaw
            }),
            entryPoint: 'main',
            // 这里的buffers可以使用多个slots，表示js中需要传入的多个TypedArray
            // 这里的attributes也可以有多个，表示每个TypedArray被划分到不同的location
            buffers: [{
                arrayStride: 8 * 4, // 因为每个顶点有3个数字，所以步长为3
                attributes: [{
                    // position
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3',
                }, {
                    // normal
                    shaderLocation: 1,
                    offset: 3 * 4,
                    format: 'float32x3',
                }, {
                    // uv
                    shaderLocation: 2,
                    offset: 6 * 4,
                    format: 'float32x2',
                }],
            }]
        },
        fragment: {
            module: device.createShaderModule({
                code: fragmentShaderRaw
            }),
            entryPoint: 'main',
            targets: [{
                format,
            }],
        },
        primitive: {
            topology: 'triangle-list',
            // cullMode: 'back', // 因为正方体是封闭的，所以通过这个封闭的图形，来从几何上剔除内部
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus',
        }
    }

    const pipeline = await device.createRenderPipelineAsync(descriptor)
    
    // ===== vertex =====
    // const vertex = new Float32Array([
    //     // xyz, uv, normal
    //     0, 0.5, 0,
    //     -0.5, -0.5, 0,
    //     0.5, -0.5, 0,
    // ])
    // const vertexBuffer = device.createBuffer({
    //     size: vertex.byteLength,
    //     usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, // COPY_DST表示这个Buffer可以被writeBuffer写入
    // })
    // device.queue.writeBuffer(vertexBuffer, 0, vertex)

    const sphereBuffer = {
        vertex: device.createBuffer({
            label: 'GPUBuffer stores vertex',
            size: sphere.vertex.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        }),
        index: device.createBuffer({
            label: 'GPUBuffer stores vertex index',
            size: sphere.index.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        }),
        vertexCount: sphere.vertexCount,
        indexCount: sphere.indexCount,
    }
    device.queue.writeBuffer(sphereBuffer.vertex, 0, sphere.vertex)
    device.queue.writeBuffer(sphereBuffer.index, 0, sphere.index)

    // ===== color =====
    const color = new Float32Array([
        1, 1, 1, 1,
    ])
    const colorBuffer = device.createBuffer({
        size: color.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, // UNIFORM只读且大小最大64KB; STORAGE可修改且WebGPU最大支持2GB
    })
    device.queue.writeBuffer(colorBuffer, 0, color)

    // ===== MVP =====
    const mvpMatrixBuffer = device.createBuffer({
        size: 4 * 4 * 4 * OBJECT_NUM,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    })

    // ===== Depth =====
    const depthTexture = device.createTexture({
        size,
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })

    // ===== Texture =====
    // 小知识： 在浏览器中，webp包含了jpeg/png/gif等格式的优点，所以在开发中，应该优先使用webp格式
    // 小知识2：视频格式，推荐VP8/9
    // 获取图片
    const textureUrl = "https://raw.githubusercontent.com/YXHXianYu/WebGPU-Learning/main/resource/XingHui.jpg"
    const res = await fetch(textureUrl)
    const img = await res.blob()
    const bitmap = await createImageBitmap(img)
    // 创建texture
    const textureSize = [bitmap.width, bitmap.height]
    const texture = device.createTexture({
        size: textureSize,
        format: 'rgba8unorm',
        usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
    })
    // 写入texture
    device.queue.copyExternalImageToTexture(
        { source: bitmap },
        { texture: texture },
        textureSize,
    )
    // 配置sampler
    const sampler = device.createSampler({
        // addressModeU: 'repeat',
        // addressModeV: 'repeat',
        magFilter: 'linear',
        minFilter: 'linear',
    })
    const textureGroup = device.createBindGroup({
        label: 'Texture Group with Texture and Sampler',
        layout: pipeline.getBindGroupLayout(1),
        entries: [{
            binding: 0,
            resource: texture.createView(),
        }, {
            binding: 1,
            resource: sampler,
        }],
    })

    // ===== Package =====
    const group = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: colorBuffer,
            }
        }, {
            binding: 1,
            resource: {
                buffer: mvpMatrixBuffer,
            }
        }]
    })

    // const vertexObject = {
    //     vertex,
    //     vertexBuffer,
    //     vertexCount,
    // }

    const objectList = {
        sphereBuffer,
    }

    const colorObject = {
        color,
        colorBuffer,
    }

    const pipelineObject = {
        pipeline,
        objectList,
        colorObject,
        mvpMatrixBuffer,
        depthTexture,
        group,
        textureGroup,
    }

    return pipelineObject
}

// ===== 关于renderPass的效率问题 =====
// 1. setPipeline的效率消耗是最大的，因为它涉及到切换shaders、深度测试、图形组装、颜色混合等相关配置
// 2. setVertexBuffer的效率消耗是第二大的，因为这个API会根据管线配置来切换数据，shader内部也要生成对应的一些局部变量
// 3. setBindGroup的效率消耗是最小的，因为它只涉及到一些指针的切换
// 所以WebGPU应用，绘制多物体时，要优先选择切换bindGroup
// 当然，因为切换也要涉及内存指针，所以尽量不要切换
// ===== 如何优化 =====
// 在一个buffer里面塞多组数据，通过不同的offset和stride进行定位
// ===== BufferOffsetAlignment =====
// WebGPU标准要求，bufferOffset需要保留对齐的空间，目前最小offset为256
// 所以buffer里存的东西越少，越浪费显存，比如color(4*4bytes)需要16倍显存
// ===== Instance Draw =====
// instance draw 要求顶点数据格式相同
// ===== 核心! =====
// “尽量减少CPU和GPU的数据交换次数”

// ===== ===== ===== Draw ===== ===== =====
function draw(device: GPUDevice, context: GPUCanvasContext, pipelineObject: any) {
    // 因为createCommandEncoder这个API没有和GPU进行交互，所以它不是异步的
    const encoder = device.createCommandEncoder()

    // ===== 录制命令部分 =====
    // 下面这个API的Pass的概念类似于“图层”
    const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear', // 'clear'清空原有内容，'load'保留原有内容
            clearValue: {r:0, g:0, b:0, a:1}, // 'clear'时使用的颜色
            storeOp: 'store', // 'store'保留结果，'discard'清除原有信息
        }],
        depthStencilAttachment: {
            view: pipelineObject.depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        }
    })
    renderPass.setPipeline(pipelineObject.pipeline)
    renderPass.setBindGroup(0, pipelineObject.group)
    renderPass.setBindGroup(1, pipelineObject.textureGroup)
    let i = 0
    let n = Object.keys(pipelineObject.objectList).length
    let delta = Math.floor(OBJECT_NUM / n)
    for(let objectName in pipelineObject.objectList) {
        renderPass.setVertexBuffer(0, pipelineObject.objectList[objectName].vertex)
        renderPass.setIndexBuffer(pipelineObject.objectList[objectName].index, 'uint16')
        renderPass.drawIndexed(pipelineObject.objectList[objectName].indexCount, delta, 0, 0, (i++) * delta)
        // console.log(i, objectName)
    }
    // renderPass.draw(pipelineObject.vertexObject.vertexCount, CUBES_NUM) // Vertex会被并行地运行3次

    renderPass.end()

    const buffer = encoder.finish()
    // 将Command今天提交，这个时候上面的指令才会被真正执行
    // 因为Submit的结果将直接绘制在屏幕上，而不需要JS来接收执行结果，所以这个API也不是异步的
    device.queue.submit([buffer])

}

// ===== ===== ===== Get MVP Matrix ===== ===== =====
function getMVPMatrix(position: any, rotation: any, scale: any, aspect: number) {
    const modelViewMatrix = mat4.create()
    // translate
    mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(position.x, position.y, position.z))
    // rotate
    mat4.rotateX(modelViewMatrix, modelViewMatrix, rotation.x)
    mat4.rotateY(modelViewMatrix, modelViewMatrix, rotation.y)
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotation.z)
    // scale
    mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scale.x, scale.y, scale.z))

    const projectionMatrix = mat4.create()
    mat4.perspective(
        projectionMatrix,
        Math.PI / 2,
        aspect,
        // canvas.width / canvas.height,
        0.1,
        3000)

    const mvpMatrix = mat4.create()
    mat4.multiply(mvpMatrix, projectionMatrix, modelViewMatrix)

    return mvpMatrix
}

// ===== ===== ===== Main ===== ===== =====
async function run() {
    // ===== Initialize =====
    const {device, format, context, size} = await initWebGPU()
    const pipelineObject = await initPipeline(device, format, size)

    // ===== Arguments =====
    const mvpMatrixArray = new Float32Array(4 * 4 * OBJECT_NUM)
    const position = new Array(OBJECT_NUM)
    const rotation = new Array(OBJECT_NUM)
    const rotationSpeed = new Array(OBJECT_NUM)
    const commonSpeed = 0.01
    let lookDistanceDelta = 0
    const randomRange = (L: number, R: number) => {
        return Math.random() * (R - L) + L
    }
    for(let i = 0; i < OBJECT_NUM; i++) {
        position[i] = {x:0, y:0, z:0}
        const positionRange = 50
        position[i].x = randomRange(-positionRange, positionRange)
        position[i].y = randomRange(-positionRange, positionRange)
        position[i].z = randomRange(-positionRange, 0) - 50

        rotation[i] = {x:0, y:0, z:0}
        rotation[i].x = randomRange(-3.14, 3.14)
        rotation[i].y = randomRange(-3.14, 3.14)
        rotation[i].z = randomRange(-3.14, 3.14)

        rotationSpeed[i] = {x:0, y:0, z:0}
        rotationSpeed[i].x = randomRange(-1.0, 1.0)
        rotationSpeed[i].y = randomRange(-1.0, 1.0)
        rotationSpeed[i].z = randomRange(-1.0, 1.0)
    }

    // ===== Animation & Rendering =====
    function frame() {
        const ratio = size.width / size.height
        for(let i = 0; i < OBJECT_NUM; i++) {
            rotation[i].x += rotationSpeed[i].x * commonSpeed
            rotation[i].y += rotationSpeed[i].y * commonSpeed
            rotation[i].z += rotationSpeed[i].z * commonSpeed
            // if(rotation[i].x < -3.14) rotation[i].x += 6.28
            // if(rotation[i].x > 3.14) rotation[i].x -= 6.28
            // if(rotation[i].y < -3.14) rotation[i].y += 6.28
            // if(rotation[i].y > 3.14) rotation[i].y -= 6.28
            // if(rotation[i].z < -3.14) rotation[i].z += 6.28
            // if(rotation[i].z > 3.14) rotation[i].z -= 6.28
            mvpMatrixArray.set((getMVPMatrix(
                {x: position[i].x, y: position[i].y, z: position[i].z + lookDistanceDelta},
                rotation[i],
                {x:1, y:1, z:1},
                ratio,
            ) as Float32Array), 4 * 4 * i)
            // device.queue.writeBuffer(pipelineObject.mvpMatrixBuffer, 4 * 4 * 4 * i, getMVPMatrix(
            //     position[i],
            //     rotation[i],
            //     {x:1, y:1, z:1},
            //     ratio,
            // ) as Float32Array)
        }
        device.queue.writeBuffer(pipelineObject.mvpMatrixBuffer, 0, mvpMatrixArray)
        draw(device, context, pipelineObject)

        requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    // document.querySelectorAll('input[type="range"]')?.forEach((input) => {
    //     input.addEventListener('input', drawWithMVP)
    // })
    document.querySelector('input[type="range"]')?.addEventListener('input', (e: Event) => {
        // get input value
        const value = (e.target as HTMLInputElement).value
        console.log(value)
        // change 
        lookDistanceDelta = Math.floor(+value)
    })

    document.querySelector('input[type="color"]')?.addEventListener('input', (e: Event) => {
        // get input color
        const color = (e.target as HTMLInputElement).value
        console.log(color)
        // parse hex color into rgb
        const r = +('0x' + color.slice(1, 3)) / 255
        const g = +('0x' + color.slice(3, 5)) / 255
        const b = +('0x' + color.slice(5, 7)) / 255
        pipelineObject.colorObject.color[0] = r
        pipelineObject.colorObject.color[1] = g
        pipelineObject.colorObject.color[2] = b
        // write colorBuffer
        device.queue.writeBuffer(pipelineObject.colorObject.colorBuffer, 0, pipelineObject.colorObject.color)
        draw(device, context, pipelineObject)
    })
}

run()

// // 检查浏览器是否支持WebGPU
// if(!navigator.gpu) {
//     throw new Error('not support webgpu')
// }

// const gpu = navigator.gpu
// document.body.innerHTML = '<h1>Hello WebGPU</h1>'

// // WebGPU的大部分API都是异步API
// async function initWebGPU() {
//     const adapter = await navigator.gpu.requestAdapter()
//     if(!adapter) {
//         throw new Error('No adapter found.')
//     }
//     const device = await adapter.requestDevice()
//     return adapter
// }