import * as THREE from 'three'
import ThreeApp from './ThreeApp.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.threeApp = new ThreeApp()
        this.sizes = this.threeApp.sizes
        this.scene = this.threeApp.scene
        this.canvas = this.threeApp.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.cameraHeight = 5
        this.aspectRatio = this.sizes.width / this.sizes.height
        this.instance = new THREE.OrthographicCamera(-this.aspectRatio*this.cameraHeight, this.aspectRatio*this.cameraHeight, this.cameraHeight, -this.cameraHeight, 0.1, 100)
        this.instance.position.set(6, 6, 6)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.aspectRatio = this.sizes.width / this.sizes.height
        this.instance.left = -this.aspectRatio*this.cameraHeight
        this.instance.right = this.aspectRatio*this.cameraHeight
        this.instance.top = this.cameraHeight
        this.instance.bottom = -this.cameraHeight
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}