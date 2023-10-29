// handling the Clear button click event

function Clear() {
  document.getElementById("form6").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/";
  });
}
