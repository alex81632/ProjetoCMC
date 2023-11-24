import Experience from './ThreeApp/ThreeApp.js'

const experience = new Experience(document.querySelector('canvas.webgl'))

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('button');
    if (button) {
        button.addEventListener('click', () => {
            experience.inverterCamera();
        });
    }
});