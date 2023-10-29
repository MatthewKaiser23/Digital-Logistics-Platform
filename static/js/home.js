// handling the Home Page button click event

document.getElementById('homePage').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/';
});