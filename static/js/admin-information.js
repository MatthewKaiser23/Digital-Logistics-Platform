// handling the Admin Page button click event

document
  .getElementById("adminPage")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    // etract data from the form elements
    const country = document.getElementById("countrySelect").value;
    const city = document.getElementById("citySelect").value;
    const restaurant = document.getElementById("restaurantSelect").value;
    const restaurantHours = document.getElementById("daysSelect").value;
    const open_time = restaurantHours.match(/\d{2}:\d{2}/)[0];
    const closing_time = restaurantHours.split("Close ")[1];
    const weather = document.getElementById("weather").value;
    const airline = document
      .getElementById("flightsSelect")
      .value.split(" | ")[0]
      .split(": ")[1];
    const departure_date = document.getElementById("datepicker").value;
    const arrival_date = document
      .getElementById("flightsSelect")
      .value.split(" | ")[2]
      .match(/\d{4}-\d{2}-\d{2}/)[0];
    const departure_ = document
      .getElementById("flightsSelect")
      .value.split(" | ")[1]
      .split(": ")[1];
    const departure_date_placeholder = new Date(departure_);
    const departure_time = `${departure_date_placeholder.getHours()}:${departure_date_placeholder.getMinutes()}`;
    const arrival_ = document
      .getElementById("flightsSelect")
      .value.split(" | ")[2]
      .split(": ")[1];
    const arrival_date_placeholder = new Date(arrival_);
    const arrival_time = `${arrival_date_placeholder.getHours()}:${arrival_date_placeholder.getMinutes()}`;
    const delivery_time = document
      .getElementById("distance")
      .value.replace(" hours", ":")
      .replace(" and ", "")
      .replace(" minutes", "");

    // store the data into a object
    const information = {
      country: country,
      city: city,
      restaurant: restaurant,
      open_time: open_time,
      closing_time: closing_time,
      weather: weather,
      airline: airline,
      departure_date: departure_date,
      arrival_date: arrival_date,
      departure_time: departure_time,
      arrival_time: arrival_time,
      delivery_time: delivery_time,
    };

    // POST the stored information 
    try {
      const response = await fetch("/admin_information", {
        method: "POST",
        body: JSON.stringify(information),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save information.");
      }

      window.location.href = "/admin";
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error}`,
      });
    }
  });
