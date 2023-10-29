// Define a mapping of countries to cities
const citiesByCountry = {
  France: ["Paris"],
  Japan: ["Tokyo"],
  USA: ["New York", "San Francisco", "Chicago"],
  Spain: ["Barcelona"],
  "United Kingdom": ["London"],
  "United Arab Emirates": ["Dubai"],
  Thailand: ["Bangkok"],
  Turkey: ["Istanbul"],
  Italy: ["Rome"],
  Australia: ["Sydney"],
  China: ["Hong Kong"],
  India: ["Mumbai"],
  Greece: ["Athens"],
  Portugal: ["Lisbon"],
  Argentina: ["Buenos Aires"],
  Brazil: ["Rio de Janeiro"],
  Canada: ["Vancouver"],
  "South Korea": ["Seoul"],
  Mexico: ["Mexico City"],
  Netherlands: ["Amsterdam"],
  Hungary: ["Budapest"],
  "Czech Republic": ["Prague"],
};

// stored the selected country and city
const countrySelect = $("#countrySelect");
const citySelect = $("#citySelect");

countrySelect.select2({
  width: "100%",
});
citySelect.select2({
  width: "100%",
});

// display the city when a country is selected
countrySelect.on("change", function () {
  const selectedCountry = countrySelect.val();
  const cities = citiesByCountry[selectedCountry] || [];

  citySelect.find("option").not(":first").remove();

  if (selectedCountry) {
    cities.forEach((city) => {
      citySelect.append(new Option(city, city, false, false));
    });
  }

  citySelect.trigger("change");
});
