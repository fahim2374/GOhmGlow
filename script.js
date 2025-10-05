const getLocationBtn = document.getElementById("getLocationBtn");
const locationStatus = document.getElementById("locationStatus");
const fetchDataBtn = document.getElementById("fetchDataBtn");
const dateInput = document.getElementById("dateInput");
const resultDiv = document.getElementById("result");

let selectedLocation = null;

// Step 1: Get user's current location
getLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    locationStatus.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        selectedLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        locationStatus.textContent = `Location found: (${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lon.toFixed(4)})`;
      },
      (error) => {
        console.error(error);
        locationStatus.textContent = "Unable to retrieve location. Please allow location access.";
      }
    );
  } else {
    locationStatus.textContent = "Geolocation is not supported by your browser.";
  }
});

// Step 2: Fetch NASA POWER API data
fetchDataBtn.addEventListener("click", async () => {
  if(!selectedLocation) return alert("Please get your location first!");

  const selectedVars = Array.from(document.querySelectorAll(".variable:checked")).map(v => v.value);
  if(selectedVars.length === 0) return alert("Select at least one weather variable!");

  const date = new Date(dateInput.value);
  if(!dateInput.value) return alert("Select a date!");

  const startDate = date.toISOString().slice(0,10).replace(/-/g,"");
  const endDate = startDate;

  const params = new URLSearchParams({
    start: startDate,
    end: endDate,
    latitude: selectedLocation.lat,
    longitude: selectedLocation.lon,
    parameters: selectedVars.join(","),
    format: "JSON"
  });

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?${params.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // For MVP, simple probability logic (replace with real calculation later)
    const processed = {};
    selectedVars.forEach(v => {
      processed[v] = { probability: Math.floor(Math.random()*100) };
    });

    // Display results
    resultDiv.innerHTML = "<h3>Weather Probabilities</h3>" + 
      Object.keys(processed).map(k => `<p>${k}: ${processed[k].probability}% chance</p>`).join("");
    
  } catch(err) {
    console.error(err);
    alert("Error fetching NASA data");
  }
});
