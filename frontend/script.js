const coordinatesElement = document.getElementById("coordinates");
let coords;

// create EventSource (through EventSource API) for the SSE endpoint
const eventSource = new EventSource("http://localhost:8000/get-coordinates");

eventSource.onopen = () => {
    console.log("EventSource Connected");
    // everytime the connnection is established clear the previous data from the UI
    coordinatesElement.innerText = "";
};

// eventSource can have event listeners based on type of event
// By default for message type of event it have the onmessage method which can be used directly or this same can be achieved through explicit eventListeners
eventSource.addEventListener("locationUpdate", function (event) {
    coords = JSON.parse(event.data);
    console.log("locationUpdate: ", coords);
    updateCoordinates(coords);
});

// in case of any error, if eventSource is not closed explicitly then client will retry the connection. a new call to the backend will happend and the cycle go on
eventSource.onerror = (error) => {
    console.error("EventSource failed: ", error);
    eventSource.close();
};

function updateCoordinates(coords) {
    // create a new paragraph element for each coordinate and append it
    const paragraph = document.createElement("p");
    paragraph.textContent = `Latitude: ${coords.lat}, Longitude: ${coords.lng}`;
    coordinatesElement.appendChild(paragraph);
}
