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

    // constructor
    constructor(
        public position: {x: number, y: number, z: number},
        public rotation: {x: number, y: number, z: number},
        public rotationSpeed: {x: number, y: number, z: number},
        public scale: {x: number, y: number, z: number},
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

    // update model matrix
    updateModelMatrix() {
        // translate
        mat4.translate(this.internalModelMatrix, this.internalModelMatrix, vec3.fromValues(this.position.x, this.position.y, this.position.z))
        // rotate
        mat4.rotateX(this.internalModelMatrix, this.internalModelMatrix, this.rotation.x)
        mat4.rotateY(this.internalModelMatrix, this.internalModelMatrix, this.rotation.y)
        mat4.rotateZ(this.internalModelMatrix, this.internalModelMatrix, this.rotation.z)
        // scale
        mat4.scale(this.internalModelMatrix, this.internalModelMatrix, vec3.fromValues(this.scale.x, this.scale.y, this.scale.z))
    }
}