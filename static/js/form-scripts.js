// first form which consists of restaurant data
async function firstForm(currentFormId, nextFormId) {
  const currentForm = document.getElementById(currentFormId);
  const restaurantSelect = $("#restaurantSelect");
  const submitButton = document.getElementById("submitButton");

  if (currentForm.checkValidity()) {
    event.preventDefault();
    submitButton.disabled = true;
    try {
      const postResponse = await fetch("/save_form_data", {
        method: "POST",
        body: new FormData(currentForm),
      });

      if (!postResponse.ok) {
        throw new Error("Failed to save form data");
      }

      const getResponse = await fetch("/get_form_data", {
        method: "GET",
      });

      if (!getResponse.ok) {
        throw new Error("Failed to get form data");
      }

      const data = await getResponse.json();

      restaurantSelect.empty();
      restaurantSelect.append('<option value="">Select a restaurant</option>');

      data.forEach(function (restaurant) {
        var option = new Option(restaurant, restaurant);
        restaurantSelect.append(option);
      });

      restaurantSelect.select2({
        width: "100%",
      });
      restaurantSelect.trigger("change");

      currentForm.classList.add("hidden");
      document.getElementById(nextFormId).classList.remove("hidden");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error}`,
      });
    } finally {
      submitButton.disabled = false;
    }
  }
  return false;
}

// second form which consists of opening days and hours of the selected restuarant
async function secondForm(currentFormId, nextFormId) {
  const currentForm = document.getElementById(currentFormId);
  const daysSelect = $("#daysSelect");
  const submitButton = document.getElementById("submitButton");

  if (currentForm.checkValidity()) {
    event.preventDefault(); // prevent the default form submission
    submitButton.disabled = true;
    try {
      const postResponse = await fetch("/save_second_form_data", {
        method: "POST",
        body: new FormData(currentForm),
      });

      if (!postResponse.ok) {
        throw new Error("Failed to save form data");
      }

      const getResponse = await fetch("/get_second_form_data", {
        method: "GET",
      });

      if (!getResponse.ok) {
        throw new Error("Failed to get form data");
      }

      const data = await getResponse.json();

      daysSelect.empty();
      daysSelect.append('<option value="">Select a day</option>');

      data.forEach(function (day) {
        var option = new Option(day, day);
        daysSelect.append(option);
      });

      daysSelect.select2({
        width: "100%",
      });
      daysSelect.trigger("change");

      currentForm.classList.add("hidden");
      document.getElementById(nextFormId).classList.remove("hidden");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error}`,
      });
    } finally {
      submitButton.disabled = false;
    }
  }
  return false;
}

// third form which consists of the current weather conditions
async function thirdForm(currentFormId, nextFormId) {
  const currentForm = document.getElementById(currentFormId);
  var inputElement = document.getElementById("weather");
  const submitButton = document.getElementById("submitButton");

  if (currentForm.checkValidity()) {
    event.preventDefault(); // prevent the default form submission
    submitButton.disabled = true;
    try {
      const postResponse = await fetch("/save_third_form_data", {
        method: "POST",
        body: new FormData(currentForm),
      });

      if (!postResponse.ok) {
        throw new Error("Failed to save form data");
      }

      const getResponse = await fetch("/get_third_form_data", {
        method: "GET",
      });

      if (!getResponse.ok) {
        throw new Error("Failed to get form data");
      }

      const data = await getResponse.json();

      inputElement.value = data[0];

      currentForm.classList.add("hidden");
      document.getElementById(nextFormId).classList.remove("hidden");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error}`,
      });
    } finally {
      submitButton.disabled = false;
    }
  }
  return false;
}

// fourth form which consists of flights and distance
async function fourthForm(currentFormId, nextFormId) {
  const currentForm = document.getElementById(currentFormId);
  const flightsSelect = $("#flightsSelect");
  var distanceElement = document.getElementById("distance");
  var inputElement = document.getElementById("openingTime");
  const submitButton = document.getElementById("submitButton");

  if (currentForm.checkValidity()) {
    event.preventDefault(); // prevent the default form submission
    submitButton.disabled = true;
    try {
      const postResponse = await fetch("/save_fourth_form_data", {
        method: "POST",
        body: new FormData(currentForm),
      });

      if (!postResponse.ok) {
        throw new Error("Failed to save form data");
      }

      const getResponse = await fetch("/get_fourth_form_data", {
        method: "GET",
      });

      if (!getResponse.ok) {
        throw new Error("Failed to get form data");
      }

      const data = await getResponse.json();

      flightsSelect.empty();
      flightsSelect.append('<option value="">Select a flight</option>');

      data["0"].forEach(function (flight) {
        var option = new Option(flight, flight);
        flightsSelect.append(option);
      });

      flightsSelect.select2({
        width: "100%",
      });
      flightsSelect.trigger("change");

      distanceElement.value = data["1"][0];

      const match = daysSelect.value.split(",");
      const openingTime = match[0];
      inputElement.value = openingTime;

      currentForm.classList.add("hidden");
      document.getElementById(nextFormId).classList.remove("hidden");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error}`,
      });
    } finally {
      submitButton.disabled = false;
    }
  }
  return false;
}

// fifth form which consits of going to the home page or to the admin page
async function lastForm(currentFormId, nextFormId) {
  const currentForm = document.getElementById(currentFormId);
  const submitButton = document.getElementById("submitButton");

  if (currentForm.checkValidity()) {
    event.preventDefault(); // prevent the default form submission
    submitButton.disabled = true;
    try {
      currentForm.classList.add("hidden");
      document.getElementById(nextFormId).classList.remove("hidden");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: `${error}`,
      });
    } finally {
      submitButton.disabled = false;
    }
  }
  return false;
}
