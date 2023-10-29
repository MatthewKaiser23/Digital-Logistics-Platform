// handling the Book Now button click event

document
  .getElementById("bookNowButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/bookings";
  });

document
  .getElementById("bookNowButtonMobile")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/bookings";
  });
