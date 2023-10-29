//  handling the Learn More button click event

document
  .getElementById("learnMore")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/description";
  });
