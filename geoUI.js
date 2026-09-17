
function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    mapLink.href = "";
    mapLink.textContent = "";

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // 1. Tell users they can click the coordinate link below
        status.textContent = "Click the coordinate below to view the area on map.";
        
        mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
        
        // Automatically fetch the place name once coordinates are found
        getPlaceName(latitude, longitude);
    }

    function error() {
        status.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by your browser";
    } else {
        status.textContent = "Locating…";
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

async function getPlaceName(lat, lon) {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    const contactEmail = "idrisa@work.com"; 
    // FIXED: Corrected the Nominatim API reverse geocoding path and parameters
    const url = `https://openstreetmap.org{lat}&lon=${lon}&email=${contactEmail}`;

    try {
        // We change this to let users know we are still looking up the name in the background
        status.textContent = "Click the coordinate below to view the area on map (Fetching place name...)";
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Unknown Area";
            const place = data.display_name;

            // FIXED: Keep the instruction visible in the status box
            status.textContent = "Click the link below to view the area on map.";
            mapLink.textContent = `City: ${city} | Place: ${place}`;
            mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`; 
        } else {
            status.textContent = "Click the link below to view map. (No address details found)";
        }

    } catch (error) {
        console.error("Failed to fetch place name:", error);
        status.textContent = "Click the link below to view map. (Could not load place name)";
    }
}

// Event Listeners
document.querySelector("#find-me").addEventListener("click", geoFindMe);
document.querySelector("#location-name").addEventListener("click", geoFindMe);
