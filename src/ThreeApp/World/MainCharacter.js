import * as THREE from 'three'
import ThreeApp from '../ThreeApp.js'
import * as CANNON from 'cannon-es'

export default class MainCharacter
{
    constructor()
    {
        this.threeApp = new ThreeApp()
        this.scene = this.threeApp.scene
        this.resources = this.threeApp.resources
        this.time = this.threeApp.time
        this.physicsWorld = this.threeApp.physicsWorld;
        this.debug = this.threeApp.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('mainCharacter')
        }

        // Resource
        this.resource = this.resources.items.mainCharacterModel

        this.setModel()
        this.setBody()
        this.setAnimation()
    }
    
    setModel()
    {
        this.model = this.resource.scene
        this.scale = 1
        this.model.scale.set(this.scale, this.scale, this.scale)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }
    setBody(){
        this.body = new CANNON.Body({
            mass:5,
            shape: new CANNON.Box(new CANNON.Vec3(.4,.5,.43))
        })
        this.body.position.set(0,1,0)

        this.physicsWorld.addBody(this.body)
    }
    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}

        console.log(this.resource.animations)


        
        this.animation.actions.rightFoward = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.leftFoward = this.animation.mixer.clipAction(this.resource.animations[1])

        this.animation.playAll = () =>
        {
            this.animation.actions.rightFoward.reset()
            this.animation.actions.rightFoward.play()
            this.animation.actions.leftFoward.reset()
            this.animation.actions.leftFoward.play()
        }

        this.animation.stopAllSmoothly = () =>
        {
            this.animation.actions.rightFoward.fadeOut(1.5)
            this.animation.actions.leftFoward.fadeOut(1.5)
        }

        if(this.debug.active)
        {
            const debugObject = {
                playAll: () => { this.animation.playAll() },
                stopAllSmoothly: () => { this.animation.stopAllSmoothly() }
            }
            this.debugFolder.add(debugObject, 'playAll')
            this.debugFolder.add(debugObject, 'stopAllSmoothly')
        }

        // Se quiser trocar entre animaçoes, descomente o codigo abaixo e comente o codigo acima ############
        
        // this.animation.actions.current = this.animation.actions.idle
        // this.animation.actions.current.play()

        // // Play the action
        // this.animation.play = (name) =>
        // {
        //     const newAction = this.animation.actions[name]
        //     const oldAction = this.animation.actions.current

        //     newAction.reset()
        //     newAction.play()
        //     newAction.crossFadeFrom(oldAction, 1)

        //     this.animation.actions.current = newAction
        // }

    }

    update()
    {
        this.model.position.copy(this.body.position).add(new THREE.Vector3(0,-0.5,0))
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}