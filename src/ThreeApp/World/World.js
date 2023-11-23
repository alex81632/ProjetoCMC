import ThreeApp from '../ThreeApp.js'
import * as THREE from 'three'
import Environment from './Environment.js'
import Floor from './Floor.js'
import MainCharacter from './MainCharacter.js'
//import test from './test.js'

export default class World
{
    constructor()
    {
        this.threeApp = new ThreeApp()
        this.scene = this.threeApp.scene
        this.resources = this.threeApp.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.mainCharacter = new MainCharacter()
            this.environment = new Environment()
            //this.test = new test()
        })

    }

    update()
    {
        if(this.fox)
            this.fox.update()
        if(this.mainCharacter)
            this.mainCharacter.update()
        /*if (this.test){
            this.test.update()
            console.log("ok")
        }*/
            
        // Controls Exemple

        if(this.threeApp.controls.keyMap['ArrowUp'])
        {
            console.log('ArrowUp')
        }
        if(this.threeApp.controls.keyMap['ArrowDown'])
        {
            console.log('ArrowDown')
        }
        if(this.threeApp.controls.keyMap['ArrowLeft'])
        {
            console.log('ArrowLeft')
        }
        if(this.threeApp.controls.keyMap['ArrowRight'])
        {
            console.log('ArrowRight')
        }
    }

    destroy()
    {
        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        // Remove all children
        while(this.scene.children.length)
        {
            this.scene.remove(this.scene.children[0])
        }
        
    }
}