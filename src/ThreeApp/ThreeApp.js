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
import Dialogues from './World/Dialogues.js'

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
        this.start = true
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.controls = new Controls()
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

        this.dialogues = new Dialogues()
        //Teste: já carrega o primeiro
        this.dialogues.showTextbox()
        this.dialogues.updateDialogue(this.dialogues.dialogueList[0].d)
    }

    inverterCamera()
    {
        return this.camera.inverterCamera()
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        //this.dialogues.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.dialogues.inputCheck()
    
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