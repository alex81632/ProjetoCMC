import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Controls from './Utils/Controls.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import PhysicsWorld from './World/PhysicsWorld.js'
import CannonDebugger from 'cannon-es-debugger'

let instance = null

export default class ThreeApp
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.threeApp = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.controls = new Controls()
        this.physicsWorld = new PhysicsWorld()
        this.physicsDebug = new CannonDebugger(this.scene,this.physicsWorld.world,{})

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.physicsWorld.update()
        if (this.debug.active){
            this.physicsDebug.update()
        }
        
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')
        this.controls.destroy()

        this.world.destroy()

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
    
}