import * as THREE from 'three'
import ThreeApp from '../ThreeApp.js'

export default class City
{
    constructor()
    {
        this.threeApp = new ThreeApp()
        this.scene = this.threeApp.scene
        this.resources = this.threeApp.resources


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
}