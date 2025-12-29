// Wait for DOM and Leaflet to be ready
window.addEventListener('load', function() {
    // ===== GLOBAL VARS =====
    let route_filtered = false;
    let route_filtered_list = [];
    let routeCounts = {};
    let vehicleMarkers = [];
    let stopMarkers = [];
    let showingStops = false;

    // user location
    let userLocationMarker = null;
    let userLocationCircle = null;

    // ===== MAP SETUP =====
    const map = L.map('map').setView([37.7749, -122.447], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);


    // ===== LEGEND =====
    const legend = L.control({ position: 'topright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const labels = [
            {color: 'lightblue', text: 'Empty'},
            {color: 'lightgreen', text: 'Few Riders'},
            {color: 'yellow', text: 'Several'},
            {color: 'lightcoral', text: 'Many Riders'},
        ];
        
        div.innerHTML = '<h4>OCCUPANCY</h4>' + labels.map(item => 
            `<div class="legend-item">
                <div class="legend-color" style="background:${item.color}"></div>
                <span>${item.text}</span>
            </div>`
        ).join('');
        
        return div;
    };
    legend.addTo(map);

    // ===== GET USER LOCATION AUTOMATICALLY =====
    getUserLocation();

    // ===== FUNCTIONS =====
    function getOccupancyColor(vehicle) {
        const colors = {
            0: "lightblue",
            1: "lightgreen",
            2: "yellow",
            3: "lightcoral"
        };
        return colors[vehicle.occupancy] || "lightgray";
    }

    function updateVehicles() {
        vehicleMarkers.forEach(marker => map.removeLayer(marker));
        vehicleMarkers = [];
        routeCounts = {};
        
        fetch("https://quote-boxes-featured-other.trycloudflare.com/vehicles/current", {
            headers: { "ngrok-skip-browser-warning": "true" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) return;
            
            const date = new Date(data[0].timestamp);
            document.getElementById('update-time').textContent = 
                `Updated ${date.toLocaleTimeString()}`;
            
            data.forEach(vehicle => {
                if (!vehicle.route_id) return;
                
                if (route_filtered && route_filtered_list.length > 0) {
                    if (!route_filtered_list.includes(String(vehicle.route_id).toUpperCase())) {
                        return;
                    }
                }
                
                if (routeCounts[vehicle.route_id]) {
                    routeCounts[vehicle.route_id].count++;
                } else {
                    routeCounts[vehicle.route_id] = {
                        count: 1,
                        name: vehicle.route_long_name || vehicle.route_short_name || vehicle.route_id,
                        color: vehicle.route_color || 'cccccc',
                        route_type: vehicle.route_type || 3
                    };
                }
                
                const color = getOccupancyColor(vehicle);
                const vehicle_icon = L.divIcon({
                    className: 'vehicle-label',
                    html: `<div style="background-color:${color}; padding: 2px 5px; border-radius: 10px; font-weight: 600; font-size: 10px;">${vehicle.route_id}</div>`,
                    iconSize: null
                });
                
                const marker = L.marker([vehicle.lat, vehicle.lon], { icon: vehicle_icon }).addTo(map);
                
                // Add tooltip with bus information
                const occupancyText = ['Empty', 'Few Riders', 'Several Riders', 'Many Riders'][vehicle.occupancy] || 'Unknown';
                marker.bindTooltip(`
                    <div style="text-align: center;">
                        <strong>${vehicle.route_id} - ${vehicle.route_name}</strong><br>
                        Occupancy: ${occupancyText}
                    </div>
                `, {
                    direction: 'top',
                    offset: [0, -10],
                    opacity: 0.95
                });
                
                vehicleMarkers.push(marker);
            });
            
            document.getElementById('bus-count').textContent = vehicleMarkers.length;
            document.getElementById('route-count').textContent = Object.keys(routeCounts).length;
            
            let html = '';
            Object.entries(routeCounts)
                .sort((a, b) => {
                    const aNum = parseInt(a[0]) || 999;
                    const bNum = parseInt(b[0]) || 999;
                    return aNum - bNum;
                })
                .forEach(([route, data]) => {
                    html += `
                        <div class="route-card">
                            <div class="route-id" style="background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1)), #${data.color};">
                                ${route}
                            </div>
                            <div class="route-info">
                                <div class="route-name">${data.name}</div>
                                <div class="route-count">${data.count} vehicle${data.count > 1 ? 's' : ''}</div>
                            </div>
                        </div>
                    `;
                });
            document.querySelector('.route-list').innerHTML = html;
        })
        .catch(error => console.error("Error fetching data:", error));
    }

    window.applyRouteFilter = applyRouteFilter;
    window.clearFilters = clearFilters;
    
    function applyRouteFilter() {
        console.log('Applying route filter');
        const route_ids_str = document.getElementById('rid').value.trim().toUpperCase();
        
        if (!route_ids_str) {
            route_filtered = false;
            route_filtered_list = [];
        } else {
            const new_route_filtered_list = route_ids_str.split(",")
                .map(raw_id => raw_id.trim())
                .filter(route_id => route_id !== "");
            
            if (new_route_filtered_list.length > 0) {
                route_filtered = true;
                route_filtered_list = new_route_filtered_list;
            }
        }
        updateVehicles();
        if (showingStops) {
            showStops();
        }
    }

    function clearFilters() {
        console.log('Clearing filters');
        route_filtered = false;
        route_filtered_list = [];
        document.getElementById('rid').value = '';
        hideStops();
        updateVehicles();
    }

    function filterByRoute(routeId) {
        console.log('Filtering by route:', routeId);
        route_filtered = true;
        route_filtered_list = [routeId];
        document.getElementById('rid').value = routeId;
        updateVehicles();
        showStops();
    }

    function toggleStops() {
        console.log('Toggling stops, current state:', showingStops);
        if (showingStops) {
            hideStops();
        } else {
            showStops();
        }
    }

    function getUserLocation() {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                // Create custom icon for user location
                const userIcon = L.divIcon({
                    className: 'user-location-marker',
                    html: `<div style="
                        width: 20px; 
                        height: 20px; 
                        background: #6366f1; 
                        border: 3px solid white; 
                        border-radius: 50%; 
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        animation: pulse 2s infinite;
                    "></div>`,
                    iconSize: [20, 20]
                });

                // Add marker at user location
                userLocationMarker = L.marker([lat, lon], { icon: userIcon })
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align: center;">
                            <strong>Your Location</strong><br>
                            <span style="font-size: 0.8rem; color: #6b7280;">
                                Accuracy: ±${Math.round(accuracy)}m
                            </span>
                        </div>
                    `);

                // Add accuracy circle
                userLocationCircle = L.circle([lat, lon], {
                    radius: accuracy,
                    color: '#6366f1',
                    fillColor: '#6366f1',
                    fillOpacity: 0.1,
                    weight: 1
                }).addTo(map);

                // Center map on user location
                // map.setView([lat, lon], 15);
            },
            // Error callback
            (error) => {
                // Silently fail - just use default SF center
                console.log('Location access denied or unavailable, using default view');
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    // ===== POLLING =====
    let pollInterval;

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(pollInterval);
        } else {
            updateVehicles();
            pollInterval = setInterval(updateVehicles, 30000);
        }
    });

    // ===== BUTTON EVENT LISTENERS =====
    // document.getElementById('apply-btn').addEventListener('click', applyRouteFilter);
    // document.getElementById('clear-btn').addEventListener('click', clearFilters);
    // document.getElementById('toggle-stops-btn').addEventListener('click', toggleStops);
    

    updateVehicles();
    pollInterval = setInterval(updateVehicles, 30000);
});


// ===== CHAT FUNCTIONALITY =====
// Add the chat code here (outside the load event listener)

// Get references to the chat elements
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const chatSendButton = document.querySelector('.chat-input button');

// Function to add a message to the chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = text;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// When user clicks Send button
chatSendButton.addEventListener('click', async function() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;
    
    addMessage('> ' + userMessage, 'user');
    chatInput.value = '';
    
    chatSendButton.disabled = true;
    chatSendButton.textContent = '...';
    
    try {
        // Call your FastAPI endpoint
        // const response = await fetch('https://quote-boxes-featured-other.trycloudflare.com/api/llm-query', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ prompt: userMessage })
        // });
        
        const data = await response.json();
        
        // Show the response
        addMessage("MUNI Agent: " + data.message, 'assistant');
        
    } catch (error) {
        addMessage('Chat assistant being built', 'assistant');
        console.error('Error:', error);
    } finally {
        // Re-enable button
        chatSendButton.disabled = false;
        chatSendButton.textContent = 'Send';
    }
});

// Send on Enter key
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        chatSendButton.click();
    }
});
