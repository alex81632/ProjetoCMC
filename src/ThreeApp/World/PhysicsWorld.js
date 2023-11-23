import * as CANNON from 'cannon-es'

export default class PhysicsWorld {
    constructor(){

        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0,-9.81,0),
        })

        //Experimenting
        this.groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        })
        /*this.sphereBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Sphere(2)
        })
        this.sphereBody.position.set(0,7,0)*/

        this.groundBody.quaternion.setFromEuler(-Math.PI/2,0,0)
        this.world.addBody(this.groundBody)
        //this.world.addBody(this.sphereBody)
    }
    update(){
        this.world.fixedStep()
    }
    addBody(body){
        this.world.addBody(body)
    }
}