import { mat4, vec3 } from 'gl-matrix'

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
    private internalPosition: vec3 = vec3.fromValues(0, 0, 0)
    private internalGaze: vec3 = vec3.fromValues(0, 0, -1)
    private internalUp: vec3 = vec3.fromValues(0, 1, 0)
    private internalViewMatrix: mat4

    // constructor
    constructor(public theta: number, public phi: number, public radius: number) {
        this.internalViewMatrix = this.lookAtOrigin()
    }

    // position
    get position(): vec3 {
        return this.internalPosition
    }
    set position(position: vec3) {
        this.internalPosition = position
        this.internalViewMatrix = this.lookAtOrigin()
    }

    // gaze
    get gaze(): vec3 {
        return this.internalGaze
    }
    set gaze(gaze: vec3) {
        this.internalGaze = gaze
        this.internalViewMatrix = this.lookAtOrigin()
    }

    // up
    get up(): vec3 {
        return this.internalUp
    }
    set up(up: vec3) {
        this.internalUp = up
        this.internalViewMatrix = this.lookAtOrigin()
    }

    // view matrix
    get viewMatrix(): mat4 {
        return this.internalViewMatrix
    }
    private set viewMatrix(viewMatrix: mat4) {
        this.internalViewMatrix = viewMatrix
    }

    // 在球坐标系上旋转
    // 此函数会根据输入的参数，自动设置position, gaze, up，并修改View Matrix
    rotateInSpherical(theta?: number, phi?: number, radius?: number) {
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

    // 通过Camera的position, gaze, up得到viewMatrix
    private getViewMatrix(): mat4 {
        let viewMatrix: mat4 = mat4.create()
        // opengl 这玩意是先列再行
        // 所以实际上，下面这个矩阵按习惯读是Tview的转置
        const Tview: mat4 = mat4.fromValues(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0, 
            this.position[0], this.position[1], this.position[2], 1
        )
        let gxt: vec3 = vec3.create()
        vec3.cross(gxt, this.gaze, this.up)
        const Rview: mat4 = mat4.fromValues(
            gxt[0], gxt[1], gxt[2], 0,
            this.up[0], this.up[1], this.up[2], 0,
            -this.gaze[0], -this.gaze[1], -this.gaze[2], 0,
            0, 0, 0, 1,
        )
        mat4.multiply(viewMatrix, Rview, Tview)
        return viewMatrix
    }

    // 通过Camera的position, gaze, up得到viewMatrix 【版本2】
    private lookAtOrigin(): mat4 {
        const that = this

        let F = vec3.create()
        {
            vec3.subtract(F, that.position, vec3.create())
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
        return mat4.fromValues(
            R[0], U[0], F[0], 0,
            R[1], U[1], F[1], 0,
            R[2], U[2], F[2], 0,
            -t[0], -t[1], -t[2], 1
        )
    }

}

export { Camera }
