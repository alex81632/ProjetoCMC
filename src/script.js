import Experience from './ThreeApp/ThreeApp.js'

document.addEventListener('DOMContentLoaded', function () {
    // Get references to the start menu and start button
    const startMenu = document.getElementById('start-menu');
    // Add click event listener to the start button

    // Add keydown event listener to the document
    document.addEventListener('keydown', function (event) {
        // Check if the pressed key is the "Enter" key (key code 13)
        if (event.key === 'Enter') {
            // Hide the start menu when the "Enter" key is pressed
            startMenu.style.display = 'none';
            const experience = new Experience(document.querySelector('canvas.webgl'))
        
            const button = document.getElementById('button')
            if (button) {
                button.addEventListener('click', () => {
                    experience.inverterCamera();
                });
            }
            document.getElementById('button').hidden = false;
        }
    });
    // Function to remove the overlay element
});