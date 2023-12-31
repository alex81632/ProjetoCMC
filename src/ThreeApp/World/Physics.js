import * as THREE from 'three'
import ThreeApp from '../ThreeApp.js'
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon';
import CannonDebugger from 'cannon-es-debugger';

export default class Physics
{
    constructor()
    {
        this.threeApp = new ThreeApp()
        this.scene = this.threeApp.scene
        this.resources = this.threeApp.resources

        this.world = new CANNON.World()
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)
        this.world.allowSleep = true
        this.world.gravity.set(0, - 9.82, 0)
        this.fowardVel = 0
        this.rightVel = 0
        this.constraintLB = null
        this.constraintRB = null
        this.constraintLF = null
        this.constraintRF = null
        this.body = null
        // this.dbg = new CannonDebugger(this.scene,this.world)

        this.empty = null

        this.debug = this.threeApp.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('cars')
            this.CannonDebugger = new CannonDebugger(this.scene, this.world)
        }

        // this.CannonDebugger = new CannonDebugger(this.scene, this.world)

        this.main = this.resources.items.mainCharacterModel.scene

        this.timeStep = 1 / 60
        this.clock = new THREE.Clock()

        this.oldTime = 0

        this.objectsToUpdate = []

        this.inverseToUpdate = []

        this.setBody()
        this.setBody(0,2,0)
        this.setAmbient()
        this.setCars()
    }

    updateControls()
    {
        let thrusting = false
        let turning = false

        if(this.threeApp.controls.keyMap['ArrowUp'])
        {
            if (this.fowardVel < 25) this.fowardVel += 1
            thrusting = true
        }
        if(this.threeApp.controls.keyMap['ArrowDown'])
        {
            if (this.fowardVel > -25) this.fowardVel -= 1
            thrusting = true
        }
        if(this.threeApp.controls.keyMap['ArrowLeft'])
        {
            if (this.rightVel > -0.6) this.rightVel -= 0.1
            turning = true
        }
        if(this.threeApp.controls.keyMap['ArrowRight'])
        {
            if (this.rightVel < 0.6) this.rightVel += 0.1
            turning = true
        }

        if (!thrusting)
        {
            if (this.fowardVel > 0) this.fowardVel -= 0.25
            if (this.fowardVel < 0) this.fowardVel += 0.25
            this.threeApp.world.mainCharacter.animation.playAll()
        }else{
            this.threeApp.world.mainCharacter.animation.stopAllSmoothly()
        }

        if (!turning)
        {
            if (this.rightVel > 0) this.rightVel -= 0.1
            if (this.rightVel < 0) this.rightVel += 0.1
        }

        this.constraintLB.setMotorSpeed(this.fowardVel)
        this.constraintRB.setMotorSpeed(this.fowardVel)
        this.constraintLF.axisA.z = this.rightVel
        this.constraintRF.axisA.z = this.rightVel

        // console.log(this.body.position.x, this.body.position.y, this.body.position.z)

        this.threeApp.camera.setPosition(this.body.position.x, this.body.position.y, this.body.position.z)
        this.threeApp.camera.instance.lookAt(this.body.position.x, this.body.position.y, this.body.position.z)
    }

    update()
    {
        if(this.debug.active) this.CannonDebugger.update()
        if (this.constraintLB != null) this.updateControls()

        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.oldTime
        this.oldTime = elapsedTime

        this.world.step(this.timeStep, deltaTime, 3)
        
        for (const object of this.objectsToUpdate)
        {
            if (object.mesh != this.carBodyMesh){
                object.mesh.position.copy(object.body.position)
                object.mesh.quaternion.copy(object.body.quaternion)
            }
            else {
                object.mesh.position.copy(object.body.position)
                object.mesh.quaternion.copy(object.body.quaternion)
                
            }
        }

        for (const object of this.inverseToUpdate)
        {
            object.body.position.copy(object.mesh.position)
            object.body.position.y = 0
            object.body.quaternion.copy(object.mesh.quaternion)
            // let objQuaternion = object.body.quaternion
            // objQuaternion = objQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            // object.body.quaternion.copy(objQuaternion)


        }

        this.animation.mixer.update(deltaTime)
        // if (this.threeApp.debug.active)
            // this.dbg.update()
    }

    setAmbient()
    {
        const cityModel = this.resources.items.cityModel

        for (const child of cityModel.scene.children)
        {
            let position = child.position
            const cannonMash = threeToCannon(child, {type: ShapeType.HULL});
            const ambientBody = new CANNON.Body({
                mass: 0,
                shape: cannonMash.shape,
                position: new CANNON.Vec3(position.x, position.y, position.z)
            })
            ambientBody.quaternion.copy(child.quaternion)
            this.world.addBody(ambientBody)
        }
    
    }



    setBody(x,y,z) {

        const carSize = 0.5
        const wheelSize = 0.15

        const carHeight = 1

        const wheelMaterial = new CANNON.Material('wheelMaterial')
        wheelMaterial.friction = 0.15
        wheelMaterial.restitution = 0.25


        // CAR BODY
        //this.scene.add(this.main)
        this.carBodyMesh = this.main.children[0]
        this.carBodyMesh.position.x = x; this.carBodyMesh.position.y = y; this.carBodyMesh.position.z = z;
        

        // POSSIVELMENTE ADD CAMERA TO CAR

        const carBodyShape = new CANNON.Box(new CANNON.Vec3(carSize, carSize / 2 , carSize))
        const carBody = new CANNON.Body({ mass: 3 })
        carBody.addShape(carBodyShape)
        carBody.position.x = this.carBodyMesh.position.x
        carBody.position.y = this.carBodyMesh.position.y + carHeight
        carBody.position.z = this.carBodyMesh.position.z
        this.world.addBody(carBody)

        this.objectsToUpdate.push({
            mesh: this.carBodyMesh,
            body: carBody
        });

        // RODAS

        const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
        
        //front left wheel
        const wheelLFGeometry = new THREE.CylinderGeometry(
            wheelSize / 2,
            wheelSize / 2,
            0.1
        )
        wheelLFGeometry.rotateZ(Math.PI / 2)
        const wheelLFMesh = new THREE.Mesh(wheelLFGeometry, phongMaterial)
        wheelLFMesh.position.x = - carSize / 2 + x
        wheelLFMesh.position.y = carHeight - wheelSize / 2
        wheelLFMesh.position.z = - carSize / 2 + z

        const wheelLFShape = new CANNON.Sphere(wheelSize / 2)
        const wheelLFBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
        wheelLFBody.addShape(wheelLFShape)
        wheelLFBody.position.x = wheelLFMesh.position.x
        wheelLFBody.position.y = wheelLFMesh.position.y
        wheelLFBody.position.z = wheelLFMesh.position.z
        this.world.addBody(wheelLFBody)

        this.objectsToUpdate.push({
             mesh: wheelLFMesh,
             body: wheelLFBody
        });

        //front right wheel
        const wheelRFGeometry = new THREE.CylinderGeometry(
            wheelSize / 2,
            wheelSize / 2,
            0.1
        )
        wheelRFGeometry.rotateZ(Math.PI / 2)
        const wheelRFMesh = new THREE.Mesh(wheelRFGeometry, phongMaterial)
        wheelRFMesh.position.y = carHeight - wheelSize / 2
        wheelRFMesh.position.x = carSize / 2 + x
        wheelRFMesh.position.z = - carSize / 2 + z
        
        const wheelRFShape = new CANNON.Sphere(wheelSize / 2)
        const wheelRFBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
        wheelRFBody.addShape(wheelRFShape)
        wheelRFBody.position.x = wheelRFMesh.position.x
        wheelRFBody.position.y = wheelRFMesh.position.y
        wheelRFBody.position.z = wheelRFMesh.position.z
        this.world.addBody(wheelRFBody)

        this.objectsToUpdate.push({
             mesh: wheelRFMesh,
             body: wheelRFBody
         });

        //back left wheel
        const wheelLBGeometry = new THREE.CylinderGeometry(
            wheelSize / 2,
            wheelSize / 2,
            0.1
        )
        wheelLBGeometry.rotateZ(Math.PI / 2)
        const wheelLBMesh = new THREE.Mesh(wheelLBGeometry, phongMaterial)
        wheelLBMesh.position.y = carHeight - wheelSize / 2
        wheelLBMesh.position.x = - carSize / 2 + x
        wheelLBMesh.position.z = carSize / 2 + z

        const wheelLBShape = new CANNON.Sphere(wheelSize / 2)
        const wheelLBBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
        wheelLBBody.addShape(wheelLBShape)
        wheelLBBody.position.x = wheelLBMesh.position.x
        wheelLBBody.position.y = wheelLBMesh.position.y
        wheelLBBody.position.z = wheelLBMesh.position.z
        this.world.addBody(wheelLBBody)

         this.objectsToUpdate.push({
             mesh: wheelLBMesh,
             body: wheelLBBody
         });

        //back right wheel
        const wheelRBGeometry = new THREE.CylinderGeometry(
            wheelSize / 2,
            wheelSize / 2,
            0.1
        )
        wheelRBGeometry.rotateZ(Math.PI / 2)
        const wheelRBMesh = new THREE.Mesh(wheelRBGeometry, phongMaterial)
        wheelRBMesh.position.y = carHeight - wheelSize / 2
        wheelRBMesh.position.x = carSize / 2 + x
        wheelRBMesh.position.z = carSize / 2 + z
        wheelRBMesh.castShadow = true

        const wheelRBShape = new CANNON.Sphere(wheelSize / 2)
        const wheelRBBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
        wheelRBBody.addShape(wheelRBShape)
        wheelRBBody.position.x = wheelRBMesh.position.x
        wheelRBBody.position.y = wheelRBMesh.position.y
        wheelRBBody.position.z = wheelRBMesh.position.z
        this.world.addBody(wheelRBBody)

         this.objectsToUpdate.push({
             mesh: wheelRBMesh,
             body: wheelRBBody
         });

        this.wheelRBBody = wheelRBBody
        this.wheelLBBody = wheelLBBody

        // CONSTRAINTS

        const leftFrontAxis = new CANNON.Vec3(1, 0, 0)
        const rightFrontAxis = new CANNON.Vec3(1, 0, 0)
        const leftBackAxis = new CANNON.Vec3(1, 0, 0)
        const rightBackAxis = new CANNON.Vec3(1, 0, 0)

        const constraintLF = new CANNON.HingeConstraint(carBody, wheelLFBody, {
            pivotA: new CANNON.Vec3(- carSize / 2, -0.5, - carSize / 2),
            axisA: leftFrontAxis,
            maxForce: 0.99,
        })
        this.world.addConstraint(constraintLF)
        const constraintRF = new CANNON.HingeConstraint(carBody, wheelRFBody, {
            pivotA: new CANNON.Vec3(carSize / 2, -0.5, - carSize / 2),
            axisA: rightFrontAxis,
            maxForce: 0.99,
        })
        this.world.addConstraint(constraintRF)
        const constraintLB = new CANNON.HingeConstraint(carBody, wheelLBBody, {
            pivotA: new CANNON.Vec3(- carSize / 2, -0.5, carSize / 2),
            axisA: leftBackAxis,
            maxForce: 0.99,
        })
        this.world.addConstraint(constraintLB)
        const constraintRB = new CANNON.HingeConstraint(carBody, wheelRBBody, {
            pivotA: new CANNON.Vec3(carSize / 2, -0.5, carSize / 2),
            axisA: rightBackAxis,
            maxForce: 0.99,
        })
        this.world.addConstraint(constraintRB)

        constraintLB.enableMotor()
        constraintRB.enableMotor()

        this.constraintLB = constraintLB
        this.constraintRB = constraintRB
        this.constraintLF = constraintLF
        this.constraintRF = constraintRF

        this.body = carBody
        this.body.position.x = x; this.body.position.y = y; this.body.position.z = z
    }
    destroy(){
        //Destroy the meshes and bodies
        for (let i = 0; i < this.objectsToUpdate.length; i++){
            this.scene.remove(this.objectsToUpdate[i].mesh)
            this.world.removeBody(this.objectsToUpdate[i].body)
        }

        this.objectsToUpdate = []
        this.carBodyMesh = null

        //Remove the constraints
        this.world.removeConstraint(this.constraintLB)
        this.world.removeConstraint(this.constraintLF)
        this.world.removeConstraint(this.constraintRB)
        this.world.removeConstraint(this.constraintRF)


    }

    setCars() {
        const carsModel = this.resources.items.cars;
    
        let length = 23;
    
        this.scene.add(carsModel.scene)
    
        this.animation = {};
    
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(carsModel.scene);

        carsModel.scene.traverse((child) =>
        {
            if(child.name.startsWith('Empty'))
            {
                let mesh = child.children[0]
                const cannonMash = threeToCannon(mesh, {type: ShapeType.HULL});
                const carBody = new CANNON.Body({
                    mass: 0,
                    shape: cannonMash.shape,
                    position: new CANNON.Vec3(child.position.x, child.position.y, child.position.z)
                })
                carBody.quaternion.copy(child.quaternion)
                this.world.addBody(carBody)

                this.inverseToUpdate.push({
                    mesh: child,
                    body: carBody,
                    mesh2: mesh
                });

            }
        }
        )
    
        // Actions
        this.animation.actions = {};
    
        for (let i = 0; i < length; i++) {
            this.animation.actions[i] = this.animation.mixer.clipAction(carsModel.animations[i]);
        }
    
        this.animation.playAll = () => {
            for (let i = 0; i < length; i++) {
                this.animation.actions[i].reset();
                this.animation.actions[i].play();
            }
        };
    
        if (this.debug.active) {
            const debugObject = {
                playAll: () => {
                    this.animation.playAll();
                },
            };
            this.debugFolder.add(debugObject, 'playAll');
        }

        this.animation.playAll()
    }
    
}