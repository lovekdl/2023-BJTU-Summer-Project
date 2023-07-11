import { mat4, vec3, vec2 } from 'gl-matrix'

/**
 * 摄像机类
 * 
 * 管理游戏中的摄像机，并给出ViewMatrix
 * 
 * 通过position, gaze, up属性来设置照相机
 * 通过viewMatrix属性来获取最新的view矩阵（类会自动维护最新的viewMatrix，直接获取即可）
 */
class Camera {
    // 属性
    public position: vec3 = vec3.fromValues(0, 0, 0)
    public gaze: vec3 = vec3.fromValues(0, 0, -1)
    public up: vec3 = vec3.fromValues(0, 1, 0)
    public target: vec3 = vec3.fromValues(0, 0, 0)
    private internalViewMatrix: mat4 = mat4.create()

    // constructor
    constructor(public theta: number, public phi: number, public radius: number) {
        this.lookAt()
    }

    // view matrix
    get viewMatrix(): mat4 {
        return this.internalViewMatrix
    }
    private set viewMatrix(viewMatrix: mat4) {
        this.internalViewMatrix = viewMatrix
    }

    /**
     * 每帧Update
     */
    public readonly AUTO_ROTATE_SPEED = Math.PI / 7200
    update(updateCameraMove?: boolean, autoRotate?: boolean) {
        if(updateCameraMove) {
            this.updateCameraMove()
        }
        if(autoRotate) {
            this.phi += this.AUTO_ROTATE_SPEED
        }
        this.rotateInSpherical()
        this.lookAt()
    }

    /**
     * 水平旋转接口
     */
    private readonly CAMERA_HORIZONTAL_ROTATE_SPEED = Math.PI / 1440
    rotateHorizontal(delta: number) {
        this.phi += delta * this.CAMERA_HORIZONTAL_ROTATE_SPEED
    }

    /**
     * 竖直旋转接口
     */
    private readonly CAMERA_VERTICAL_ROTATE_SPEED = Math.PI / 1440
    private readonly CAMERA_VERTICAL_ROTATE_MAX = Math.PI - 0.01
    rotateVertical(delta: number) {
        this.theta += delta * this.CAMERA_VERTICAL_ROTATE_SPEED
        this.theta = Math.max(0.01 , Math.min(this.CAMERA_VERTICAL_ROTATE_MAX, this.theta))
    }

    /**
     * Zoom接口
     */
    private readonly CAMERA_ZOOM_SPEED = 200
    private readonly CAMERA_RADIUS_MIN = 100
    private readonly CAMERA_RADIUS_MAX = 2500
    zoom(delta: number) {
        this.radius += delta * this.CAMERA_ZOOM_SPEED
        this.radius = Math.max(this.CAMERA_RADIUS_MIN, Math.min(this.CAMERA_RADIUS_MAX, this.radius))
    }

    /**
     * 移动摄像机中心接口
     */
    buttonPressed = {
        W: false,
        S: false,
        A: false,
        D: false,
        Space: false,
        ControlLeft: false,
    }
    private readonly CAMERA_MOVE_SPEED = 1
    private readonly CAMERA_MOVE_Y_MIN = -100
    private readonly CAMERA_MOVE_Y_MAX = 100
    private updateCameraMove() {
        let direct: vec2 = vec2.fromValues(this.gaze[0], this.gaze[2])
        vec2.normalize(direct, direct)
        direct[0] *= this.CAMERA_MOVE_SPEED
        direct[1] *= this.CAMERA_MOVE_SPEED
        if(this.buttonPressed.W) {
            this.target[0] += direct[0] 
            this.target[2] += direct[1] 
        }
        if(this.buttonPressed.S) {
            this.target[0] -= direct[0] 
            this.target[2] -= direct[1] 
        }
        if(this.buttonPressed.A) {
            this.target[0] += direct[1]
            this.target[2] -= direct[0]
        }
        if(this.buttonPressed.D) {
            this.target[0] -= direct[1]
            this.target[2] += direct[0]
        }
        if(this.buttonPressed.Space) {
            this.target[1] += this.CAMERA_MOVE_SPEED
            this.target[1] = Math.max(this.CAMERA_MOVE_Y_MIN, Math.min(this.CAMERA_MOVE_Y_MAX, this.target[1]))
        }
        if(this.buttonPressed.ControlLeft) {
            this.target[1] -= this.CAMERA_MOVE_SPEED
            this.target[1] = Math.max(this.CAMERA_MOVE_Y_MIN, Math.min(this.CAMERA_MOVE_Y_MAX, this.target[1]))
        }
    }

    // 在球坐标系上旋转
    // 此函数会根据输入的参数，自动设置position, gaze, up，并修改View Matrix
    private rotateInSpherical(theta?: number, phi?: number, radius?: number) {
        if(!theta || !phi || !radius) {
            theta = this.theta
            phi = this.phi
            radius = this.radius
        }
        const x = Math.sin(theta) * Math.cos(phi)
        const y = Math.cos(theta)
        const z = Math.sin(theta) * Math.sin(phi)
        const v = Math.sqrt(x * x + z * z)

        // console.log("theta: " + theta + "; phi: " + phi + "; radius: " + radius)
        // console.log("x: " + x)
        // console.log("y: " + y)
        // console.log("z: " + z)
        // console.log("v: " + v)

        this.position = vec3.fromValues(radius * x, radius * y, radius * z)
        vec3.add(this.position, this.position, this.target)
        this.gaze = vec3.fromValues(-x, -y, -z)
        if(Math.abs(theta - Math.PI/2) <= 1e-5) {
            this.up = vec3.fromValues(0, 1, 0)
        } else if(Math.abs(v) <= 1e-5) {
            this.up = vec3.fromValues(-Math.cos(phi), 0, -Math.sin(phi))
        } else {
            this.up = vec3.fromValues(-x*y/v, v, -z*y/v)
        }

        // console.log("position: " + this.position)
        // console.log("gaze: " + this.gaze)
        // console.log("up: " + this.up)
    }

    // 更新Camera的viewMatrix
    // 输入: position, target, (假设)up朝上
    // 输出: viewMatrix
    private lookAt(target?: vec3) {
        const that = this

        if(!target) {
            target = this.target
        }

        let F = vec3.create()
        {
            vec3.subtract(F, that.position, this.target) // here is negative
            vec3.normalize(F, F)
        }

        let R = vec3.create()
        {
            vec3.cross(R, vec3.fromValues(0, 1, 0), F)
            vec3.normalize(R, R)
        }

        let U = vec3.create()
        {
            vec3.cross(U, F, R)
            vec3.normalize(U, U)
        }

        let t = vec3.create()
        t[0] = vec3.dot(this.position, R)
        t[1] = vec3.dot(this.position, U)
        t[2] = vec3.dot(this.position, F)

        this.viewMatrix = mat4.fromValues(
            R[0], U[0], F[0], 0,
            R[1], U[1], F[1], 0,
            R[2], U[2], F[2], 0,
            -t[0], -t[1], -t[2], 1
        )
    }
    
    // 得到ViewMatrix ^ -1
    // 输入: position, target, (假设)up朝上
    // 输出: viewMatrix
    getInverseViewMatrix(target?: vec3): mat4 {
        const that = this

        if(!target) {
            target = this.target
        }

        let F = vec3.create()
        vec3.subtract(F, that.position, this.target) // here is negative
        vec3.normalize(F, F)

        let R = vec3.create()
        vec3.cross(R, vec3.fromValues(0, 1, 0), F)
        vec3.normalize(R, R)

        let U = vec3.create()
        vec3.cross(U, F, R)
        vec3.normalize(U, U)

        let t = this.position

        return mat4.fromValues(
            R[0], R[1], R[2], 0,
            U[0], U[1], U[2], 0,
            F[0], F[1], F[2], 0,
            t[0], t[1], t[2], 1
        )
    }

    // ===== Camera Animation =====
    private readonly ANIMATION_CURVE_MAX = 5
    private haveAnimation: boolean       = false
    private animationTarget: vec3        = vec3.create()
    private animationTheta: number       = 0
    private animationPhi: number         = 0
    private animationRadius: number      = 100
    private animationFrames: number      = 0

    private animationCurFrames: number   = 0
    private animationCurveA: number      = 0
    private animationCurveB: number      = 0
    private animationCurveSum: number    = 0
    private animationTargetDelta: vec3   = vec3.create()
    private animationThetaDelta: number  = 0
    private animationPhiDelta: number    = 0
    private animationRadiusDelta: number = 0
    
    /**
     * calculate y = ax^2 + bx + c
     * this curve is through (0, 0), (f/2, h), (f, 0)
     * => a=-4h/f^2; b=4h/f; c=0
     */
    private calculateAnimationCurve(x: number): number {
        return this.animationCurveA * x * x + this.animationCurveB * x
    }

    /**
     * 执行动画的一帧
     */
    updateAnimation() {
        if(!this.haveAnimation) {
            return;
        }
        this.animationCurFrames += 1

        // console.log("Ani: " + this.animationCurFrames + " / " + this.animationFrames)
        if(this.animationCurFrames >= this.animationFrames) {
            this.target = vec3.clone(this.animationTarget)
            this.theta = this.animationTheta
            // this.phi = this.animationPhi
            this.radius = this.animationRadius
            this.haveAnimation = false
            return;
        }

        const v = this.calculateAnimationCurve(this.animationCurFrames)
        this.target[0] += this.animationTargetDelta[0] * v
        this.target[1] += this.animationTargetDelta[1] * v
        this.target[2] += this.animationTargetDelta[2] * v
        this.theta  += this.animationThetaDelta * v
        // this.phi    += this.animationPhiDelta * v
        this.radius += this.animationRadiusDelta * v
    }
    
    /**
     * 根据输入的四个参数，启动摄像机动画 (With ease in out)
     */
    startAnimation(target: vec3, theta: number, radius: number, frames: number) {
        if(this.haveAnimation) {
            console.log("Last animation is running so it will be executed right now.") 
            this.target = vec3.clone(this.animationTarget)
            this.theta = this.animationTheta
            // this.phi = this.animationPhi
            this.radius = this.animationRadius
        }

        // record basic parameters
        this.animationTarget = vec3.clone(target)
        this.animationTheta  = theta
        // this.animationPhi    = phi
        this.animationRadius = radius
        this.animationFrames = frames
        this.animationCurFrames = 0

        // calculate the curve
        const f = frames;
        const h = this.ANIMATION_CURVE_MAX
        this.animationCurveA = -4 * h / (f * f)
        this.animationCurveB = 4 * h / f
        this.animationCurveSum = 0
        for(let i = 1; i < this.animationFrames; i++) {
            this.animationCurveSum += this.calculateAnimationCurve(i)
        }
        this.animationTargetDelta[0] = (target[0] - this.target[0]) / this.animationCurveSum
        this.animationTargetDelta[1] = (target[1] - this.target[1]) / this.animationCurveSum
        this.animationTargetDelta[2] = (target[2] - this.target[2]) / this.animationCurveSum
        this.animationThetaDelta = (theta - this.theta) / this.animationCurveSum
        // this.animationPhiDelta = (phi - this.phi) / this.animationCurveSum
        this.animationRadiusDelta = (radius - this.radius) / this.animationCurveSum
        
        this.haveAnimation = true
    }
}

export { Camera }
