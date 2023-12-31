// Planet

import { mat4, vec3 } from 'gl-matrix'

/**
 * 行星类
 * 
 * 记录了单个行星的数据
 * 
 * 在星图中，我们把单个行星就看作一个恒星系。如果该行星处在双星系统，那么就渲染两个恒星系
 * 
 * 因为每一帧，星球都会转动，所以ModelMatrix也会一起改变
 * 所以这里和Camera不同，不会动态维护ModelMatrix，而是需要手动调用updateModelMatrix()函数，才会更新ModelMatrix
 * 
 * 注意！update()会自动调用updateModelMatrix()，所以请勿调用两次，避免资源浪费
 */
class Planet {
    // rendering property
    private internalModelMatrix: mat4 = mat4.create()

    // ===== ===== ===== Constants ===== ===== =====

    /**
     * Star Shader Types
     * 
     * 恒星共有7种，分别为OBAFGKM
     * 除了恒星，还有黑洞和公用行星
     * 因为行星只需要行星视图下渲染一个，所以我们不需要多个行星
     */
    static readonly STAR_SHADER_TYPE_MIN:       number = 0
    static readonly STAR_SHADER_TYPE_MAX:       number = 8
    static readonly STAR_SHADER_TYPE_BLACKHOLE: number = 0
    static readonly STAR_SHADER_TYPE_O:         number = 1
    static readonly STAR_SHADER_TYPE_B:         number = 2
    static readonly STAR_SHADER_TYPE_A:         number = 3
    static readonly STAR_SHADER_TYPE_F:         number = 4
    static readonly STAR_SHADER_TYPE_G:         number = 5
    static readonly STAR_SHADER_TYPE_K:         number = 6
    static readonly STAR_SHADER_TYPE_M:         number = 7
    static readonly STAR_SHADER_TYPE_PLANET:    number = 8

    static readonly STAR_SCALE_K: number = 1.5
    static readonly STAR_SCALE: Array<number> = [
        30.0 * this.STAR_SCALE_K,
        6.0 * this.STAR_SCALE_K,
        4.0 * this.STAR_SCALE_K,
        2.0 * this.STAR_SCALE_K,
        1.75 * this.STAR_SCALE_K,
        1.5 * this.STAR_SCALE_K,
        1.25 * this.STAR_SCALE_K,
        1.0 * this.STAR_SCALE_K,
        0.0,
    ]

    static readonly PLANET_TEXTURE_MIN: number = 0
    static readonly PLANET_TEXTURE_MAX: number = 11
    static readonly PLANET_TEXTURE_EARTH:    number = 0
    static readonly PLANET_TEXTURE_CERES:    number = 1
    static readonly PLANET_TEXTURE_HAUMEA:   number = 2
    static readonly PLANET_TEXTURE_MAKEMAKE: number = 3
    static readonly PLANET_TEXTURE_ERIS:     number = 4
    static readonly PLANET_TEXTURE_MERCURY:  number = 5
    static readonly PLANET_TEXTURE_VENUS:    number = 6
    static readonly PLANET_TEXTURE_MARS:     number = 7
    static readonly PLANET_TEXTURE_JUPITER:  number = 8
    static readonly PLANET_TEXTURE_SATURN:   number = 9
    static readonly PLANET_TEXTURE_URANUS:   number = 10
    static readonly PLANET_TEXTURE_NEPTUNE:  number = 11


    // constructor
    constructor(
        public position: {x: number, y: number, z: number},
        public rotation: {x: number, y: number, z: number},
        public rotationSpeed: {x: number, y: number, z: number},
        public scale: {x: number, y: number, z: number},
        
        // 恒星radius
        public starRadius: number,
        // 恒星的shader与model类型
        public starShaderType: number,
        // 行星的shader与model类型
        public planetTextureType: number,
        // 行星的数据ID
        public id: number,
    ) {

    }

    // modelMatrix
    get modelMatrix(): mat4 {
        return this.internalModelMatrix
    }
    private set modelMatrix(modelMatrix: mat4) {
        this.internalModelMatrix = modelMatrix
    }

    // update property (call 1 time per frame)
    update() {
        this.rotation.x += this.rotationSpeed.x;
        this.rotation.y += this.rotationSpeed.y;
        this.rotation.z += this.rotationSpeed.z;
        this.updateModelMatrix()
    }

    // reset planet scale
    resetScale() {
        const t = this.starShaderType
        this.scale = {x: Planet.STAR_SCALE[t], y: Planet.STAR_SCALE[t], z: Planet.STAR_SCALE[t]}
        this.updateModelMatrix()
    }

    // update model matrix
    updateModelMatrix() {
        this.internalModelMatrix = mat4.create()
        // translate
        mat4.translate(this.internalModelMatrix, this.internalModelMatrix, vec3.fromValues(this.position.x, this.position.y, this.position.z))
        // rotate
        mat4.rotateX(this.internalModelMatrix, this.internalModelMatrix, this.rotation.x)
        mat4.rotateY(this.internalModelMatrix, this.internalModelMatrix, this.rotation.y)
        mat4.rotateZ(this.internalModelMatrix, this.internalModelMatrix, this.rotation.z)
        // scale
        mat4.scale(this.internalModelMatrix, this.internalModelMatrix, vec3.fromValues(this.scale.x, this.scale.y, this.scale.z))
    }

    // create a planet
    static createPlanet(
        position: {x: number, y: number, z: number},
        rotation: {x: number, y: number, z: number},
        rotationSpeed: {x: number, y: number, z: number},
        starShaderType: number,
        planetTextureType: number,
        id: number,
    ): Planet {
        const t = starShaderType
        return new Planet(
            position,
            rotation,
            rotationSpeed,
            {x: this.STAR_SCALE[t], y: this.STAR_SCALE[t], z: this.STAR_SCALE[t]},
            this.STAR_SCALE[t],
            Math.max(this.STAR_SHADER_TYPE_MIN, Math.min(this.STAR_SHADER_TYPE_MAX, t)),
            planetTextureType,
            id,
        )
    }
}

export { Planet }
