var id = -1;
var temp = null;
var map = null;

// load the grid data
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/get_admin_information");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    // columns and rows of grid
    var tabledata = [];
    const data = await response.json();
    data["0"].map((information, i) => {
      tabledata.push({
        id: i + 1,
        name: `User${i + 1}`,
        country: information.country,
        city: information.city,
        restaurant: information.restaurant,
        rating: information.rating,
        open_time: information.open_time,
        closing_time: information.closing_time,
        weather: information.weather,
        airline: information.airline,
        departure_date: information.departure_date,
        arrival_date: information.arrival_date,
        departure_time: information.departure_time,
        arrival_time: information.arrival_time,
        delivery_time: information.delivery_time,
      });
    });

    // create functionality for the grid
    var table = new Tabulator("#admin", {
      data: tabledata,
      height: "311px",
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 6,
      paginationCounter: "rows",
      paginationCounter: "rows",
      columns: [
        { title: "Id", field: "id", width: 50, frozen: true },
        { title: "Name", field: "name" },
        { title: "Country", field: "country" },
        { title: "City", field: "city" },
        { title: "Restaurant", field: "restaurant" },
        {
          title: "Rating",
          field: "rating",
          formatter: "star",
          hozAlign: "center",
        },
        { title: "Open_time", field: "open_time" },
        { title: "Closing_time", field: "closing_time" },
        { title: "Weather", field: "weather" },
        { title: "Airline", field: "airline" },
        { title: "Departure_date", field: "departure_date" },
        { title: "Arrival_date", field: "arrival_date" },
        { title: "Departure_time", field: "departure_time" },
        { title: "Arrival_time", field: "arrival_time" },
        { title: "Delivery_time", field: "delivery_time" },
      ],
    });

    // display map and route on row clickS
    table.on("rowClick", async function (e, row) {
      e.preventDefault();
      var rowData = row.getData();
      id = rowData.id - 1;

      if (data["1"] && id >= 0 && temp != id) {
        temp = id;
        if (map) {
          map.off(); // turn off all event listeners
          map.remove(); // remove the map
          map = null; // set map variable to null
        }

        // create a map instance and set its center and zoom level
        routeElement = document.getElementById("route");
        routeElement.innerHTML = "Route";
        map = L.map("map").setView(
          [data["1"][id][1][1], data["1"][id][1][0]],
          13
        );

        // add a tile layer to the map (you can choose a different tile provider)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map);
        // define the start and end points
        var startPoint = L.latLng(data["1"][id][1][1], data["1"][id][1][0]); 
        var endPoint = L.latLng(data["1"][id][0][1], data["1"][id][0][0]); 

        // payload for api call
        payload = {
          coordinates: data["1"][id],
          radiuses: [-1, 5000],
        };

        // make a POST api call
        const options = {
          method: "POST",
          headers: {
            Accept:
              "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            Authorization:
              data["3"],
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        };

        await fetch(
          data["4"],
          options
        )
          .then(function (response) {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(function (data) {
            // extract the route data from the response
            L.geoJSON(data).addTo(map);
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              text: `${error}`,
            });
          });
        L.marker(startPoint).addTo(map); // add start point marker
        L.marker(endPoint).addTo(map); // add end point marker
      } else {
        routeElement = document.getElementById("route");
        routeElement.innerHTML = "";
      }
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      text: `${error}`,
    });
  }
});
