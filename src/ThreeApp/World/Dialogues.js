import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
import ThreeApp from '../ThreeApp'

export default class Dialogues {
    constructor(){
        this.threeApp = new ThreeApp()
        this.scene = this.threeApp.scene
        this.camera = this.threeApp.camera

        this.dialogueIterate = 0
        this.dialogueList = [
            {d: "Finalmente cheguei na cidade. Mal posso esperar para ir visitar a minha filha e ver os meus netinhos. (Pressione Espaço para continuar)", finish:false},
            {d: "Esperava não ter muitos problemas de locomoção desta vez, mas aparentemente os ônibus estão lotados!", finish:false},
            {d: "Não tem como eu entrar em um desses ônibus desse jeito... terei que ir a pé. Minha sugestão para mim mesmo: procurar por rampas.", finish:false},
            {d: "Quem sabe eu não aproveito e passo na lotérica que fica no caminho...", finish:true},
            {d: "Finalmente cheguei. O caminho foi bem difícil", finish:true}, //A partir daqui é quando ele chega
        ]

        this.keyDown = false
       // this.start = false
    }
    isHidden(){
        return document.getElementById("textbox").style.display == 'none'
    }
    hideTextbox(){
        document.getElementById("textbox").style.display = 'none';
    }
    showTextbox(){
        document.getElementById("textbox").style.display = 'flex';
    }
    updateDialogue(dialogue){
        document.getElementById("text").innerHTML = dialogue
    }
    inputCheck(){
        //this.start = document.getElementById("capa").style.display == 'none'
       // console.log(this.start)
        console.log(document.getElementById('capa'))
        if (this.threeApp.controls.keyMap['Space'] && !this.isHidden() && !this.keyDown && this.dialogueIterate < this.dialogueList.length && this.threeApp.start){
            this.keyDown = true
            if (this.dialogueList[this.dialogueIterate].finish == true){
                this.dialogueIterate++
                this.hideTextbox()
            }
            else{
                this.dialogueIterate++;
                this.updateDialogue(this.dialogueList[this.dialogueIterate].d)
            }
        }
        //Detect OnKeyUp Event
        if (!this.threeApp.controls.keyMap['Space'] && this.keyDown){
            this.keyDown = false
        }
    }


}