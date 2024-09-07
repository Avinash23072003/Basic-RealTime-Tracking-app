const socket=io();
console.log("Heyaa")
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude,longitude}=position.coords;
            socket.emit("send-location",{latitude,longitude})


        },
        (error)=>{
            console.error(error);
        },
        {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,
        }

    )
}
const map = L.map("map").setView([0, 0], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '©MapByAvinash'
}).addTo(map);

const markers={};


socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update marker position
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker
    }
    // Optionally set the view on the map to the new location
    map.setView([latitude, longitude]);
});


    socket.on("user-disconnected", (id) => {
        if (markers[id]) {
            map.removeLayer(markers[id]); // Remove the marker from the map
            delete markers[id];           // Properly delete the marker from the markers object
        }
    });
    