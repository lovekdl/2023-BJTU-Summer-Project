import shaderRaw from "./shader.wgsl?raw"
import postprocessRaw from "./postprocess.wgsl?raw"
import * as sphere from "./util/sphere"
import { mat4, vec3, vec4 } from 'gl-matrix'

import { Camera } from './camera'
import { Planet } from './planet'

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

    // ===== ===== ===== Renderer Properties ===== ===== =====

    private haveSetup: boolean = false
    private haveRun:   boolean = false
    // created when initWebGPU
    private device?: GPUDevice = undefined
    private context?: GPUCanvasContext = undefined
    private format: GPUTextureFormat = "rgba8unorm"
    private canvasSize: {width: number, height: number} = {width: 0, height: 0}

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

    // created when initTexture
    private depthTexture?: GPUTexture = undefined
    private texture?: GPUTexture = undefined

    // created when initSampler
    private sampler?: GPUSampler = undefined

    // created when initGroup
    private transformGroup?: GPUBindGroup = undefined
    private textureGroup?: GPUBindGroup = undefined


    // ===== ===== ===== Data Properties ===== ===== =====

    private camera: Camera
    private numOfPlanets: number
    private planets: Array<Planet>

    private projectionMatrix: mat4 = mat4.create()

    // ===== ===== ===== Mode ===== ===== =====
    
    // private renderingMode: string

    // ===== ===== ===== Constants ===== ===== =====

    // 摄像机(View矩阵)相关
    private readonly CAMERA_THETA: number = Math.PI / 9 * 2
    private readonly CAMERA_PHI: number = 0
    private readonly CAMERA_RADIUS: number = 1000

    // 透视矩阵相关
    private readonly PERSPECTIVE_FOVY: number = Math.PI / 2
    private readonly PERSPECTIVE_NEAR: number = 0.1
    private readonly PERSPECTIVE_FAR: number = 10000

    // 星球生成相关
    private readonly COMMON_SPEED: number = 0.01
    private readonly POSITION_RANGE: number = 50

    // 旋臂分布相关
    private readonly NORMAL_DIST_VARIANCE = 70
    private readonly SPIRAL_SIZE = 100
    private readonly SPIRAL_L = -0.3 * Math.PI
    private readonly SPIRAL_R = 2.5 * Math.PI

    // Update相关
    private readonly ROTATION_SPEED = Math.PI / 3600

    // ===== ===== ===== Public Methods ===== ===== =====

    constructor() {
        // ===== Camera =====
        this.camera = new Camera(this.CAMERA_THETA, this.CAMERA_PHI, this.CAMERA_RADIUS)

        // ===== Load Planets =====
        this.numOfPlanets = 20000
        this.planets = new Array<Planet>(this.numOfPlanets)


        this.planets = this.randomGalaxyStar(this.numOfPlanets)

        // const positions = this.randomGalaxyStar(this.numOfPlanets)
        // for(let i = 0; i < this.planets.length; i++) {
        //     this.planets[i] = Planet.createPlanet(
        //         positions[i], {
        //             x: this.randomRange(-3.14, 3.14),
        //             y: this.randomRange(-3.14, 3.14),
        //             z: this.randomRange(-3.14, 3.14),
        //         }, {
        //             x: this.randomRange(-1.0, 1.0) * this.COMMON_SPEED,
        //             y: this.randomRange(-1.0, 1.0) * this.COMMON_SPEED,
        //             z: this.randomRange(-1.0, 1.0) * this.COMMON_SPEED,
        //         },
        //         Planet.STAR_SHADER_TYPE_G
        //     )
        //     // console.log(this.planets[i].starShaderType)
        // }
    }

    /**
     * 初始化
     */
    async setup() {
        const that = this

        this.camera.rotateInSpherical()

        await this.initWebGPU()
        await this.initPipeline()
        await this.initBuffer()
        await this.initTexture()
        await this.initSampler()
        await this.initGroup()

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
        this.camera.rotateInSpherical()
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

        console.log(that.starShaderTypeArray)

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
            that.camera.rotateInSpherical()
            that.device!.queue.writeBuffer(that.viewMatrixBuffer!, 0, (that.camera.viewMatrix) as Float32Array)

            that.draw()

            requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)

        this.haveRun = true;
    }

    /**
     * 水平旋转接口
     */
    private readonly CAMERA_HORIZONTAL_ROTATE_SPEED = Math.PI / 1440
    rotateHorizontal(delta: number) {
        if(!this.haveRun) {
            throw new Error("Renderer hasn't run")
        }
        this.camera.phi += delta * this.CAMERA_HORIZONTAL_ROTATE_SPEED
        // console.log("camera.phi: " + this.camera.phi)
    }

    /**
     * 竖直旋转接口
     */
    private readonly CAMERA_VERTICAL_ROTATE_SPEED = Math.PI / 1440
    rotateVertical(delta: number) {
        if(!this.haveRun) {
            throw new Error("Renderer hasn't run")
        }
        this.camera.theta += delta * this.CAMERA_VERTICAL_ROTATE_SPEED
        this.camera.theta = Math.max(0, Math.min(Math.PI, this.camera.theta))
        // console.log("camera.theta: " + this.camera.theta)
    }

    /**
     * Zoom接口
     */
    private readonly CAMERA_ZOOM_SPEED = 50
    zoom(delta: number) {
        if(!this.haveRun) {
            throw new Error("Renderer hasn't run")
        }
        this.camera.radius += delta * this.CAMERA_ZOOM_SPEED
        // console.log("camera.radius: " + this.camera.radius)
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
    private readonly SELECT_PLANET_HIT_DISTANCE = 20
    selectPlanet(cx: number, cy: number): number {
        const tx = cx - 0.5
        const ty = cy - 0.5

        const nearHeight = 2 * this.PERSPECTIVE_NEAR * Math.tan(this.PERSPECTIVE_FOVY * 0.5)
        const nearWidth = this.canvasSize.width / this.canvasSize.height * nearHeight
        
        const BA4: vec4 = vec4.fromValues(tx * nearWidth, ty * nearHeight, this.PERSPECTIVE_NEAR, 0.0)
        const inverseViewMatrix: mat4 = mat4.create()
        mat4.invert(inverseViewMatrix, this.camera.viewMatrix)
        vec4.transformMat4(BA4, BA4, inverseViewMatrix)
        const BA: vec3 = vec3.fromValues(BA4[0], BA4[1], BA4[2])
        const A: vec3 = this.camera.position
        
        const identity: mat4 = mat4.create()
        mat4.mul(identity, inverseViewMatrix, this.camera.viewMatrix)

        console.log(this.planets[0].position)

        let mnDis = -1
        let mnId = -1
        for(let i = 0; i < this.numOfPlanets; i++) {
            const CA: vec3 = vec3.create()
            vec3.sub(CA, vec3.fromValues(this.planets[i].position.x, this.planets[i].position.y, this.planets[i].position.z), A)

            // console.log("BA: " + BA + ";\nCA: " + CA)
            
            vec3.cross(CA, BA, CA)
            const d = vec3.len(CA) / vec3.len(BA)


            if(d <= this.SELECT_PLANET_HIT_DISTANCE && (mnId == -1 || d <= mnDis)) {
                mnId = i
                mnDis = d
            }
        }

        console.log(mnId + ": " + mnDis)

        return mnId
    }
    

    // ===== ===== ===== Private Methods ===== ===== =====

    /**
     * 随机一个[L, R]的实数
     */
    private randomRange(L: number, R: number) {
        return Math.random() * (R - L) + L
    }

    /**
     * 随机一个二维符合正态分布的坐标
     */
    private randomNormalDist(mean: number, variance: number): {x: number, y: number} {
        let u1 = 1 - Math.random(); // (0, 1]
        let u2 = 1 - Math.random();
        u1 = Math.sqrt(-2.0 * Math.log(u1))
        u2 = 2.0 * Math.PI * u2
        let z1 = u1 * Math.cos(u2); // random normal (0, 1)
        let z2 = u1 * Math.sin(u2);
        return {
            x: z1 * variance + mean,
            y: z2 * variance + mean,
        }
    }


    /**
     * 根据angle, u, a, b生成一个等角螺线上的一个随机点（无正态分布)
     */
    private equaiangularSpiral(angle: number, u: number, a: number, b: number): {x: number, y: number} {
        const f = a * Math.pow(Math.E, b * u)
        return {
            x: f * Math.cos(u + angle),
            y: f * Math.sin(u + angle),
        }
    }

    /**
     * 在银河系4条旋臂的基础上，随机出n个位置
     */
    private randomGalaxyStar(num: number): Array<Planet> {
        const L = this.SPIRAL_L
        const R = this.SPIRAL_R
        const deltaSpiral = Math.floor(num / 4)
        const deltaStar = (R - L) / deltaSpiral

        let planets = new Array(num)
        let idx = 0;
        for(let i = 0; i <= 3; i++) { // 枚举每条旋臂
            let t = L
            const angle = i * Math.PI / 2.0
            for(let j = 0; j < deltaSpiral || (i == 3 && idx < num); j++, idx++, t += deltaStar) { // 枚举旋臂上的每个位置
                
                const origin = this.equaiangularSpiral(angle, t, this.SPIRAL_SIZE, 0.4)
                const delta = {
                    x: this.randomNormalDist(0, this.NORMAL_DIST_VARIANCE).x,
                    y: this.randomNormalDist(0, this.NORMAL_DIST_VARIANCE).x,
                    z: this.randomNormalDist(0, this.NORMAL_DIST_VARIANCE).x,
                }

                let position = {
                    x: origin.x + delta.x,
                    y: 0        + delta.y,
                    z: origin.y + delta.z,
                }

                let type = this.randomRange(0, 1)

                planets[idx] = Planet.createPlanet(
                    position, {
                        x: this.randomRange(-3.14, 3.14),
                        y: this.randomRange(-3.14, 3.14),
                        z: this.randomRange(-3.14, 3.14),
                    }, {
                        x: this.randomRange(-1.0, 1.0) * this.COMMON_SPEED,
                        y: this.randomRange(-1.0, 1.0) * this.COMMON_SPEED,
                        z: this.randomRange(-1.0, 1.0) * this.COMMON_SPEED,
                    },
                    (type <= 0.002) ? (Planet.STAR_SHADER_TYPE_O) :
                    (type <= 0.004) ? (Planet.STAR_SHADER_TYPE_B) :
                    (type <= 0.012) ? (Planet.STAR_SHADER_TYPE_A) :
                    (type <= 0.060) ? (Planet.STAR_SHADER_TYPE_F) :
                    (type <= 0.143) ? (Planet.STAR_SHADER_TYPE_G) :
                    (type <= 0.242) ? (Planet.STAR_SHADER_TYPE_K) :
                    (Planet.STAR_SHADER_TYPE_M)
                )
                

            }
        }

        return planets
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

        // ===== 录制命令部分 =====
        // 下面这个API的Pass的概念类似于“图层”

        const renderPass = encoder.beginRenderPass({
            colorAttachments: [{
                view: that.context!.getCurrentTexture().createView(),
                // view: intermediateTexture.createView(),
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

        const buffer = encoder.finish()
        // 将Command今天提交，这个时候上面的指令才会被真正执行
        // 因为Submit的结果将直接绘制在屏幕上，而不需要JS来接收执行结果，所以这个API也不是异步的
        this.device!.queue.submit([buffer])
    }

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
                    code: shaderRaw
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
                    code: shaderRaw
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


    private async initPostprocess() {
        const that = this

        // ===== Post-process Pipeline =====
        const descriptor: GPURenderPipelineDescriptor = {
            layout: 'auto',
            vertex: {
                module: that.device!.createShaderModule({
                    code: postprocessRaw
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
                    code: postprocessRaw
                }),
                entryPoint: 'fragment_main',
                targets: [{
                    format: that.format,
                }],
            },
            primitive: {
                topology: 'triangle-list',
                // cullMode: 'back', // 因为正方体是封闭的，所以通过这个封闭的图形，来从几何上剔除内部
            }
        }
        this.postprocessPipeline = await that.device!.createRenderPipelineAsync(descriptor)


        // ===== Post-process Buffer =====
        
        // ===== Post-process Texture =====
        
        // ===== Post-process Group =====

        
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
                label: 'GPUBuffer stores vertex index',
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
        
        // ===== Intermediate Texture =====
        const intermediateTexture = this.device!.createTexture({
            size: that.canvasSize,
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.RENDER_ATTACHMENT,
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
            }],
        })
    }
}


let renderer: BlueSpaceRenderer
try {
    renderer = new BlueSpaceRenderer()
    renderer.setup().then(() => {
        renderer.run()
    })
} catch (error) {
    throw new Error("Intializing renderer failed: " + error)
}

const starmapElement = document.getElementById("StarMap")
let isMouseMiddleDown: boolean = false
let last = {x: 0, y: 0}
starmapElement!.addEventListener("mousedown", (e) => {
    if(e.which === 1) {
        const cx = e.offsetX / renderer.canvasSize.width
        const cy = (e.offsetY - 64) / (renderer.canvasSize.height - 64)
        const planetId = renderer.selectPlanet(cx, cy)
        console.log(e.offsetX, e.offsetY, cx, cy, planetId)
    } else if(e.which === 2) {
        isMouseMiddleDown = true
        last.x = e.clientX
        last.y = e.clientY
    }
})
starmapElement!.addEventListener("mousemove", (e) => {
    if(isMouseMiddleDown && e.which === 2) {
        // console.log("middle drag delta: " + (e.clientX - last.x) + ", " + (e.clientY - last.y))
        renderer.rotateHorizontal(e.clientX - last.x)
        renderer.rotateVertical(-(e.clientY - last.y))
        last.x = e.clientX
        last.y = e.clientY
    }
})
starmapElement!.addEventListener("mouseup", (e) => {
    if(e.which === 2) {
        isMouseMiddleDown = false
    }
})
starmapElement!.addEventListener("mousewheel", (e) => {
    if((e as WheelEvent).deltaY > 0) {
        renderer.zoom(1)
    } else if((e as WheelEvent).deltaY < 0) {
        renderer.zoom(-1)
    }
})

window.oncontextmenu = function () {
    return false;     // cancel default menu
}

// export { BlueSpaceRenderer }
