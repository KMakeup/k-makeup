// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.nav');
    
    menuButton.addEventListener('click', function() {
        this.classList.toggle('is-open');
        nav.classList.toggle('is-open');
    });
});
