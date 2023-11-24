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

        this.cos45 = Math.cos(45)
        this.vel = 0.2

        this.setInstance()
        // this.setControls()

        // Add event listener for keydown events
        document.addEventListener('keydown', (event) => {
            // Check if the pressed key is the "Enter" key (key code 13)
            if (event.key === 'Enter') {
                // Hide the start menu when the "Enter" key is pressed
                this.inverterCamera();
            }
        });
    }

    inverterCamera()
    {
        this.posVector.x = -this.posVector.x
        this.posVector.z = -this.posVector.z
        console.log(this.posVector)
    }

    setInstance()
    {
        this.cameraHeight = 5
        this.aspectRatio = this.sizes.width / this.sizes.height
        this.posVector = new THREE.Vector3(20, 20, 20)
        this.instance = new THREE.OrthographicCamera(-this.aspectRatio*this.cameraHeight, this.aspectRatio*this.cameraHeight, this.cameraHeight, -this.cameraHeight, 0.001, 100)
        this.instance.position.set(this.posVector.x, this.posVector.y, this.posVector.z)
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))
        this.scene.add(this.instance)
    }

    setPosition(_x, _y, _z)
    {
        this.instance.position.set(this.posVector.x + _x, this.posVector.y + _y, this.posVector.z + _z)
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
        // this.controls.update()

        
    }
}