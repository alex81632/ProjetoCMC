import * as THREE from 'three'
import ThreeApp from '../ThreeApp.js'
import CANNON from 'cannon'
export default class City
{
    constructor()
    {
        this.threeApp = new ThreeApp()
        this.scene = this.threeApp.scene
        this.resources = this.threeApp.resources

        this.spawnPoints = [
            new CANNON.Vec3(83,1,0),
            new CANNON.Vec3(-1.2,1,-39.48),

        ] //list of checkpoints

        this.currentSpawn= this.spawnPoints[0] //start position
        // Resource
        this.resource = this.resources.items.cityModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scale = 1
        this.model.scale.set(this.scale, this.scale, this.scale)
        this.scene.add(this.model)

        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.castShadow = true
        //         child.receiveShadow = true
        //     }
        // })
    }
    update(){
        //Update Spawnpoint if it has body
        if (!this.threeApp.world.physics.body) return
        for (let i = 0; i < this.spawnPoints.length; i++){
            let dist = this.threeApp.world.physics.body.position.distanceTo(this.spawnPoints[i])
            if (dist < 5){
                this.currentSpawn = this.spawnPoints[i]
            }
        }

        this.respawn_check()
    }
    respawn_check(){
        //Respawn if stopped or fallen
        let stopped = (Math.abs(this.threeApp.world.physics.fowardVel) < 0.01) && (Math.abs(this.threeApp.world.physics.rightVel) < 0.01)
        //let fallen = (new THREE.Vector3(0,1,0).angleTo(new THREE.Vector3(0,0,-1).applyQuaternion(this.threeApp.world.physics.body)) < 100)
        if (stopped){
            this.threeApp.world.physics.destroy()
            this.threeApp.world.physics.setBody(this.currentSpawn.x,this.currentSpawn.y,this.currentSpawn.z)
        }
    }
    
}