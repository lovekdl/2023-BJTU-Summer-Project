import planetShader from "../shaders/planet.wgsl?raw"
import composite1Shader from "../shaders/composite1.wgsl?raw"
import composite2Shader from "../shaders/composite2.wgsl?raw"
import finalShader from "../shaders/final.wgsl?raw"
import * as sphere from "../util/sphere"
import * as rectangle from "../util/rectangle"
import { mat4, vec4, vec3 } from 'gl-matrix'

import { Camera } from './camera'
import { Planet } from './planet'
import { StarGenerator } from "./starGenerator"

/**
 * 蓝色空间渲染器
 * 
 * 渲染星图
 * 
 */
class BlueSpaceRenderer {

    // ===== ===== ===== Renderer Properties ===== ===== =====

    private haveSetup: boolean = false
    // private haveRun:   boolean = false
    // created when initWebGPU
    private device?: GPUDevice = undefined
    private context?: GPUCanvasContext = undefined
    private format: GPUTextureFormat = "rgba8unorm"
    public canvasSize: {width: number, height: number} = {width: 0, height: 0}

    // created when initPipeline
    private pipeline?: GPURenderPipeline = undefined

    // created when initBuffer (Buffer & Array)
    private sphereBuffer?: {vertex: GPUBuffer, index: GPUBuffer, numOfVertex: number, numOfIndex: number} = undefined
    private modelMatrixBuffer?: GPUBuffer = undefined
    private viewMatrixBuffer?: GPUBuffer = undefined
    private projectionMatrixBuffer?: GPUBuffer = undefined
    private starShaderTypeBuffer?: GPUBuffer = undefined

    private modelMatrixArray: Float32Array = new Float32Array()
    private starShaderTypeArray: Float32Array = new Float32Array()

    private environmentBuffer?: GPUBuffer = undefined
    private cameraPositionBuffer?: GPUBuffer = undefined

    // created when initTexture
    private depthTexture?: GPUTexture = undefined
    private texture?: GPUTexture = undefined

    // created when initSampler
    private sampler?: GPUSampler = undefined

    // created when initGroup
    private transformGroup?: GPUBindGroup = undefined
    private textureGroup?: GPUBindGroup = undefined

    // About Planet View
    private isPlanetMode: boolean = false
    private lightPositionBuffer?: GPUBuffer = undefined
    private phongCoefficientBuffer?: GPUBuffer = undefined
    private planetModelMatrixBuffer?: GPUBuffer = undefined

    private planetTexture?: GPUTexture = undefined
    

    // ===== Post-process =====
    private intermediateTextures?: Array<GPUTexture> = undefined

    private postprocess?: Array<{
        label: string,
        pipeline: GPURenderPipeline,
        buffer: {vertex: GPUBuffer, index: GPUBuffer, numOfVertex: number, numOfIndex: number},
        group: GPUBindGroup,
        colorAttachment?: GPUTextureView,
    }> = undefined

    // ===== ===== ===== Data Properties ===== ===== =====

    public camera: Camera
    private numOfPlanets: number
    private planets: Array<Planet>

    private projectionMatrix: mat4 = mat4.create()

    // ===== ===== ===== Mode ===== ===== =====
    
    // private renderingMode: string

    // ===== ===== ===== Constants ===== ===== =====

    // 摄像机(View矩阵)相关
    private readonly CAMERA_THETA: number = Math.PI / 9 * 2
    private readonly CAMERA_PHI: number = 0
    private readonly CAMERA_RADIUS: number = 1300

    // 透视矩阵相关
    private readonly PERSPECTIVE_FOVY: number = Math.PI / 2
    private readonly PERSPECTIVE_NEAR: number = 0.1
    private readonly PERSPECTIVE_FAR: number = 10000

    // Post-process相关
    private readonly INTERMEDIATE_TEXTURE_NUM = 3
    private readonly POSTPROCESS_NUM = 3

    // ===== ===== ===== Public Methods ===== ===== =====

    /**
     * 构造函数
     *
     * 由于渲染器需要异步初始化，所以必须按照如下方法进行实例化
     *   let renderer: BlueSpaceRenderer
     *   try {
     *     renderer = new BlueSpaceRenderer()
     *     renderer.setup().then(() => {
     *       renderer.run()
     *     }}
     *   } catch (error) {
     *     console.log("Error: ", error)
     *   }
     * 具体详见：https://stackoverflow.com/questions/35743426/async-constructor-functions-in-typescript
     */
    constructor() {
        // ===== Camera =====
        this.camera = new Camera(this.CAMERA_THETA, this.CAMERA_PHI, this.CAMERA_RADIUS)

        // ===== Load Planets =====
        this.numOfPlanets = 20000
        this.planets = StarGenerator.randomGalaxyStar(this.numOfPlanets)
    }

    /**
     * 初始化
     */
    async setup() {
        const that = this

        this.camera.update()

        await this.initWebGPU()
        await this.initPipeline()
        await this.initBuffer()
        await this.initTexture()
        await this.initSampler()
        await this.initGroup()
        await this.initPostprocess()

        // ===== Projection Matrix =====
        // 因为需要使用到canvasSize，所以需要在WebGPU初始化后才能定义Perspective矩阵
        mat4.perspective(
            this.projectionMatrix,
            this.PERSPECTIVE_FOVY,
            this.canvasSize.width / this.canvasSize.height,
            this.PERSPECTIVE_NEAR,
            this.PERSPECTIVE_FAR
        )

        // ===== Load View Matrix & Projection Matrix =====
        // this.camera.position = vec3.fromValues(0, 1000, 0)
        // this.camera.gaze = vec3.fromValues(0, -1, 0)
        // this.camera.up = vec3.fromValues(0, 0, -1)
        that.device!.queue.writeBuffer(that.viewMatrixBuffer!, 0, (this.camera.viewMatrix) as Float32Array)
        that.device!.queue.writeBuffer(that.projectionMatrixBuffer!, 0, this.projectionMatrix as Float32Array)
        
        console.log("viewMatrix: " + this.camera.viewMatrix)
        console.log("projectionMatrix: " + this.projectionMatrix)
        
        // ===== Load Planets to GPU =====
        for(let i = 0; i < that.planets.length; i++) {
            that.planets[i].update()
            that.modelMatrixArray.set(that.planets[i].modelMatrix as Float32Array, 4 * 4 * i)
            that.starShaderTypeArray.set(Float32Array.from([that.planets[i].starShaderType]), i)
        }
        that.device!.queue.writeBuffer(that.modelMatrixBuffer!, 0, that.modelMatrixArray)
        that.device!.queue.writeBuffer(that.starShaderTypeBuffer!, 0, that.starShaderTypeArray)

        // console.log(that.starShaderTypeArray)

        // 初始化完毕
        this.haveSetup = true
    }

    /**
     * 蓝色空间渲染器，启动！
     */
    async run() {
        if(!this.haveSetup) {
            throw new Error("Renderer is not installed.")
        }
        const that = this

        // ===== Animation & Rendering =====
        function frame() {
            // for(let i = 0; i < that.planets.length; i++) {
            //     that.planets[i].update()
            //     that.modelMatrixArray.set((that.planets[i].modelMatrix as Float32Array), 4 * 4 * i)
            // }
            // that.device!.queue.writeBuffer(that.modelMatrixBuffer!, 0, that.modelMatrixArray)
            
            // that.camera.phi += that.ROTATION_SPEED
            that.camera.update(true)
            that.device!.queue.writeBuffer(that.viewMatrixBuffer!, 0, (that.camera.viewMatrix) as Float32Array)
            that.device!.queue.writeBuffer(that.cameraPositionBuffer!, 0, that.camera.position as Float32Array)

            that.draw()

            requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)

        // this.haveRun = true;
    }

    /**
     * 返回canvasSize
     */
    // TODO

    /**
     * 判断鼠标点击到哪个行星系
     *
     * 鼠标点击位置 (cx, cy), cx cy in [0, 1]
     * 鼠标相对位置 (tx, ty), tx ty in [-0.5, 0.5]
     */
    private readonly SELECT_PLANET_HIT_COEFFICIENT_2 = 0.05
    selectPlanet2(cx: number, cy: number): number {
        const tx = cx - 0.5
        const ty = -(cy - 0.5) - 0.01

        // console.log("click in " + tx + ", " + ty)

        const nearHeight = 2 * this.PERSPECTIVE_NEAR * Math.tan(this.PERSPECTIVE_FOVY * 0.5)
        const nearWidth = this.canvasSize.width / this.canvasSize.height * nearHeight
        
        const BA: vec3 = vec3.fromValues(tx * nearWidth, ty * nearHeight, this.PERSPECTIVE_NEAR)
        vec3.normalize(BA, BA)

        // console.log("BA: " + BA)
        
        let mnDis = -1
        let mnId = -1
        let mnD = -1
        for(let i = 0; i < this.numOfPlanets; i++) {
            const S: vec3 = vec3.create()
            const pos: vec4 = vec4.fromValues(this.planets[i].position.x, this.planets[i].position.y, this.planets[i].position.z, 1.0)
            vec4.transformMat4(pos, pos, this.camera.viewMatrix)
            const CA: vec3 = vec3.fromValues(pos[0], pos[1], -pos[2])
            vec3.normalize(CA, CA)


            vec3.cross(S, BA, CA)
            let d = vec3.len(S) / vec3.len(BA)
            const dis = vec3.len(CA)

            d = d * 10 / this.planets[i].starRadius

            // if(i == 0) {
            //     console.log("Planet0: " + pos)
            //     console.log("tPos: "+"("+pos[0]+","+pos[1]+","+pos[2]+")"+"\nBA: "+BA+";\nCA: "+CA+"\nS:"+S+"\nd: "+d+"\ndis:"+dis)
            // }

            if(d <= this.SELECT_PLANET_HIT_COEFFICIENT_2 && (mnId == -1 || dis < mnDis)) {
                mnId = i
                mnDis = dis
                mnD = d
            }
        }

        console.log(mnId + ": " + mnD + ", " + mnDis)

        return mnId
    }
    
    // compare in world coordinate system
    private readonly SELECT_PLANET_HIT_COEFFICIENT = 20
    selectPlanet(cx: number, cy: number): number {
        let tx = cx - 0.5
        let ty = -(cy - 0.5)

        const nearHeight = 2 * this.PERSPECTIVE_NEAR * Math.tan(this.PERSPECTIVE_FOVY * 0.5)
        const nearWidth = this.canvasSize.width / this.canvasSize.height * nearHeight
        
        const B4: vec4 = vec4.fromValues(tx * nearWidth, ty * nearHeight, -this.PERSPECTIVE_NEAR, 1.0)

        this.camera.update()

        console.log("A: " + this.camera.position)
        vec4.transformMat4(B4, B4, this.camera.getInverseViewMatrix())
        console.log("B: " + B4)

        // const A: vec3 = vec3.fromValues(this.camera.position[0], this.camera.position[1], this.camera.position[2])
        const A: vec3 = this.camera.position
        const BA: vec3 = vec3.create()
        vec3.sub(BA, vec3.fromValues(B4[0], B4[1], B4[2]), A)
        
        let mnDis = -1
        let mnId = -1
        let mnD = -1
        for(let i = 0; i < this.numOfPlanets; i++) {
            const CA: vec3 = vec3.create()
            const C: vec3 = vec3.fromValues(this.planets[i].position.x, this.planets[i].position.y, this.planets[i].position.z)
            vec3.sub(CA, C, A)

            const S: vec3 = vec3.create()
            vec3.cross(S, BA, CA)
            let d = vec3.len(S) / vec3.len(BA)
            const depth = vec3.len(CA)

            d = d - this.planets[i].starRadius

            if(i == 0) {
                console.log(" - C" + i + ": " + C + "\nd: "+d)
            }

            if(d <= this.SELECT_PLANET_HIT_COEFFICIENT && (mnId == -1 || d < mnDis)) {
                mnId = i
                mnDis = d
                mnD = d
            }
        }

        console.log(mnId + ": " + mnD + ", " + mnDis)

        return mnId
    }


    // ===== ===== ===== Private Methods ===== ===== =====

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

    /**
     * 绘制函数
     */
    private draw() {
        if(!this.haveSetup) {
            throw new Error("Renderer is not installed.")
        }
        const that = this

        // 因为createCommandEncoder这个API没有和GPU进行交互，所以它不是异步的
        const encoder = this.device!.createCommandEncoder()

        // console.log("Format: " + this.context!.getCurrentTexture().format)
        // console.log("Format View: " + this.context!.getCurrentTexture().createView())

        // ===== 录制命令部分 =====
        // 下面这个API的Pass的概念类似于“图层”
        {
            const renderPass = encoder.beginRenderPass({
                colorAttachments: [{
                    // view: that.context!.getCurrentTexture().createView(),
                    view: that.intermediateTextures![0].createView(),
                    loadOp: 'clear', // 'clear'清空原有内容，'load'保留原有内容
                    clearValue: {r:0, g:0, b:0, a:1}, // 'clear'时使用的颜色
                    storeOp: 'store', // 'store'保留结果，'discard'清除原有信息
                }],
                depthStencilAttachment: {
                    view: that.depthTexture!.createView(),
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                }
            })
            // 绑定Pipeline和BindGroup
            renderPass.setPipeline(that.pipeline!)
            renderPass.setBindGroup(0, that.transformGroup!)
            renderPass.setBindGroup(1, that.textureGroup!)
            // 绑定Vertex/IndexBuffer，并且按Index绘制
            renderPass.setVertexBuffer(0, that.sphereBuffer!.vertex)
            renderPass.setIndexBuffer(that.sphereBuffer!.index, 'uint16')
            renderPass.drawIndexed(that.sphereBuffer!.numOfIndex, that.numOfPlanets, 0, 0, 0)
            // 结束
            renderPass.end()
        }

        for(let i = 0; i < this.POSTPROCESS_NUM; i++) {
            let postprocessPass = encoder.beginRenderPass({
                colorAttachments: [{
                    view: 
                        (that.postprocess![i].colorAttachment)
                        ? (that.postprocess![i].colorAttachment!)
                        : (that.context!.getCurrentTexture().createView()),
                    loadOp: 'clear', // 'clear'清空原有内容，'load'保留原有内容
                    clearValue: {r:0, g:0, b:0, a:1}, // 'clear'时使用的颜色
                    storeOp: 'store', // 'store'保留结果，'discard'清除原有信息
                }],
            })
            // 绑定Pipeline和BindGroup
            postprocessPass.setPipeline(that.postprocess![i].pipeline)
            postprocessPass.setBindGroup(0, that.postprocess![i].group)
            // 绑定Vertex/IndexBuffer，并且按Index绘制
            postprocessPass.setVertexBuffer(0, that.postprocess![i].buffer.vertex)
            postprocessPass.setIndexBuffer(that.postprocess![i].buffer.index, 'uint16')
            postprocessPass.drawIndexed(that.postprocess![i].buffer.numOfIndex, 1, 0, 0, 0)
            // 结束
            postprocessPass.end()
        }

        const buffer = encoder.finish()
        // 将Command今天提交，这个时候上面的指令才会被真正执行
        // 因为Submit的结果将直接绘制在屏幕上，而不需要JS来接收执行结果，所以这个API也不是异步的
        this.device!.queue.submit([buffer])
    }

    // ===== ===== ===== Initialize Many Things ===== ===== =====

    /**
     * 初始化WebGPU
     */
    private async initWebGPU() {
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
    // 1. 定义数据ffset client
    // 1.1 定义TypedArray
    // 1.2 定义Buffer (size, usage)
    // 1.3 写入Buffer (device.queue.writeBuffer)
    // 2. 修改Pipeline
    // 2.1 修改Pipeline的属性，设置解析方式
    // 3. 在draw时进行使用
    // 3.1 传入对应location (setVertexBuffer)
    // 3.2 在draw时指定绘制的顶点个数
    /**
     * 初始化Pipeline
     */
    private async initPipeline() {
        const that: BlueSpaceRenderer = this

        // pipeline
        const descriptor: GPURenderPipelineDescriptor = {
            layout: 'auto',
            vertex: {
                module: that.device!.createShaderModule({
                    code: planetShader
                }),
                entryPoint: 'vertex_main',
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
                module: that.device!.createShaderModule({
                    code: planetShader
                }),
                entryPoint: 'fragment_main',
                targets: [{
                    format: that.format,
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
        this.pipeline = await that.device!.createRenderPipelineAsync(descriptor)
    }


    /**
     * 初始化Buffer&Array
     * 
     * UniformBuffer适用于只读的小数据
     * StorageBuffer适用于大数据，且在Shader中可以被修改
     * 
     * Buffer目前我知道的有两种用法：
     * 第一种是用于表示Vertex/Index，在RenderPass中设置
     * 第二种是用于表示一些全局变量，绑定在BindGroup中
     */
    private async initBuffer() {
        const that = this

        // ===== Models =====
        this.sphereBuffer = {
            vertex: that.device!.createBuffer({
                label: 'GPUBuffer stores vertex',
                size: sphere.vertex.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            }),
            index: that.device!.createBuffer({
                label: 'GPUBuffer stores index',
                size: sphere.index.byteLength,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            }),
            numOfVertex: sphere.vertexCount,
            numOfIndex: sphere.indexCount,
        }
        that.device!.queue.writeBuffer(that.sphereBuffer!.vertex, 0, sphere.vertex)
        that.device!.queue.writeBuffer(that.sphereBuffer!.index, 0, sphere.index)

        // ===== MVP Matrix Buffer =====
        this.modelMatrixBuffer = that.device!.createBuffer({
            size: 4 * 4 * 4 * that.numOfPlanets,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
        this.viewMatrixBuffer = that.device!.createBuffer({
            size: 256,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
        this.projectionMatrixBuffer = that.device!.createBuffer({
            size: 256,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        // ===== Model Matrix Array =====
        this.modelMatrixArray = new Float32Array(4 * 4 * that.numOfPlanets)

        // ===== Star Shader Type =====
        this.starShaderTypeBuffer = that.device!.createBuffer({
            size: 4 * that.numOfPlanets,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
        this.starShaderTypeArray = new Float32Array(that.numOfPlanets)

        // ===== Environment Buffer =====
        this.environmentBuffer = that.device!.createBuffer({
            size: 256,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
        this.device!.queue.writeBuffer(that.environmentBuffer!, 0,
            Float32Array.from([that.canvasSize.width, that.canvasSize.height])
        )
        
        // ===== Camera Position Buffer =====
        this.cameraPositionBuffer = that.device!.createBuffer({
            size: 3 * 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
        this.device!.queue.writeBuffer(that.cameraPositionBuffer!, 0, that.camera.position as Float32Array)
    }

    /**
     * 初始化Texture
     */
    private async initTexture() {
        const that = this

        // ===== Depth =====
        this.depthTexture = that.device!.createTexture({
            size: that.canvasSize,
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
        this.texture = that.device!.createTexture({
            size: textureSize,
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        })
        // 写入texture
        that.device!.queue.copyExternalImageToTexture(
            { source: bitmap },
            { texture: that.texture! },
            textureSize,
        )
    }

    /**
     * 初始化Sampler
     */
    private async initSampler() {
        // 配置sampler
        this.sampler = this.device!.createSampler({
            // addressModeU: 'repeat',
            // addressModeV: 'repeat',
            magFilter: 'linear',
            minFilter: 'linear',
        })
    }

    /**
     * 初始化Group
     * 
     * Group的作用是传入Shader中的全局变量，
     * 可以传入Buffer、Texture、Sampler
     */
    private async initGroup() {
        const that = this

        // 绑定变换矩阵的Group
        this.transformGroup = this.device!.createBindGroup({
            label: 'MVP Matrix Buffer & Other Buffer',
            layout: that.pipeline!.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: {
                    buffer: that.modelMatrixBuffer!,
                }
            }, {
                binding: 1,
                resource: {
                    buffer: that.viewMatrixBuffer!,
                }
            }, {
                binding: 2,
                resource: {
                    buffer: that.projectionMatrixBuffer!,
                }
            }, {
                binding: 3,
                resource: {
                    buffer: that.starShaderTypeBuffer!,
                }
            }]
        })

        // 绑定纹理的Group
        this.textureGroup = this.device!.createBindGroup({
            label: 'Texture Group with Texture and Sampler',
            layout: that.pipeline!.getBindGroupLayout(1),
            entries: [{
                binding: 0,
                resource: that.texture!.createView(),
            }, {
                binding: 1,
                resource: that.sampler!,
            }, {
                binding: 2,
                resource: { buffer: that.environmentBuffer! }
            }, {
                binding: 3,
                resource: { buffer: that.cameraPositionBuffer! }
            }],
        })
    }

    // ===== ===== ===== Post-process ===== ===== =====
    /**
     * 后处理相关组件的初始化
     */
    private async initPostprocess() {
        const that = this

        this.intermediateTextures = new Array(this.INTERMEDIATE_TEXTURE_NUM)
        for(let i = 0; i < this.INTERMEDIATE_TEXTURE_NUM; i++) {
            this.intermediateTextures[i] = this.device!.createTexture({
                size: that.canvasSize,
                format: 'bgra8unorm',
                usage:
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            })
        }

        this.postprocess = new Array(this.POSTPROCESS_NUM)

        // texture[0] => texture[1]
        this.postprocess[0] = await this.createSimplePipeline(
            "Composite1",
            composite1Shader,
            [{
                binding: 0,
                resource: { buffer: that.environmentBuffer! }
            }, {
                binding: 1,
                resource: that.sampler!,
            }, {
                binding: 2,
                resource: that.intermediateTextures![0].createView(),
            }],
            that.intermediateTextures![1].createView()
        )

        // texture[1] => texture[2]
        this.postprocess[1] = await this.createSimplePipeline(
            "Composite2",
            composite2Shader,
            [{
                binding: 0,
                resource: { buffer: that.environmentBuffer! }
            }, {
                binding: 1,
                resource: that.sampler!,
            }, {
                binding: 2,
                resource: that.intermediateTextures![1].createView(),
            }],
            that.intermediateTextures![2].createView()
        )

        // texture[0] & texture[2] => Final
        this.postprocess[2] = await this.createSimplePipeline(
            "Final",
            finalShader,
            [{
                binding: 0,
                resource: { buffer: that.environmentBuffer! }
            }, {
                binding: 1,
                resource: that.sampler!,
            }, {
                binding: 2,
                resource: that.intermediateTextures![0].createView(),
            }, {
                binding: 3,
                resource: that.intermediateTextures![2].createView(),
            }]
        )
    }

    /**
     * 异步的创建一个简单管线
     * 简单管线只有一个BindGroup
     * @param label 标签 
     * @param shader 着色器
     * @param bindGroupEntries BindGroup的内容
     * @param colorAttachment 管线的ColorAttachment
     * @returns 一个建立好的简单管线
     */
    private async createSimplePipeline(label: string, shader: string, bindGroupEntries: Iterable<GPUBindGroupEntry>, colorAttachment?: GPUTextureView) {
        const that = this

        // ===== Post-process Pipeline =====
        const descriptor: GPURenderPipelineDescriptor = {
            layout: 'auto',
            vertex: {
                module: that.device!.createShaderModule({
                    code: shader
                }),
                entryPoint: 'vertex_main',
                buffers: [{
                    arrayStride: 5 * 4,
                    attributes: [{
                        // position
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3',
                    }, {
                        // uv
                        shaderLocation: 1,
                        offset: 3 * 4,
                        format: 'float32x2',
                    }],
                }]
            },
            fragment: {
                module: that.device!.createShaderModule({
                    code: shader
                }),
                entryPoint: 'fragment_main',
                targets: [{
                    format: that.format,
                }],
            },
            primitive: {
                topology: 'triangle-list',
            }
        }
        const pipeline = await that.device!.createRenderPipelineAsync(descriptor)

        // ===== Post-process Buffer =====
        const buffer = {
            vertex: that.device!.createBuffer({
                label: 'GPUBuffer stores vertex',
                size: rectangle.vertex.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            }),
            index: that.device!.createBuffer({
                label: 'GPUBuffer stores index',
                size: rectangle.index.byteLength,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            }),
            numOfVertex: rectangle.vertexCount,
            numOfIndex: rectangle.indexCount,
        }
        this.device!.queue.writeBuffer(buffer.vertex, 0, rectangle.vertex)
        this.device!.queue.writeBuffer(buffer.index, 0, rectangle.index)

        // ===== Post-process Group =====
        const group = this.device!.createBindGroup({
            label: 'Postprocess Group ' + label,
            layout: pipeline.getBindGroupLayout(0),
            entries: bindGroupEntries,
        })

        return {
            label,
            pipeline,
            buffer,
            group,
            colorAttachment,
        }
    }
}

export { BlueSpaceRenderer }
