document.querySelector('.discover-button').addEventListener('click', function() {
    window.location.href = '#chi-siamo';
});


window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        preloader.classList.add('hidden'); // Nasconde il preloader
    }, 2000);
});