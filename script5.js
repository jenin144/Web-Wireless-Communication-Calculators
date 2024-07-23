// Event listener for the calculate button
document.getElementById('calculateBtn').addEventListener('click', calculateCellularSystemDesign);

function calculateCellularSystemDesign() {
    // Read inputs from the form
    const slotsPerCarrier = parseFloat(document.getElementById('slotsPerCarrier').value);
    const cityArea = parseFloat(document.getElementById('cityArea').value);
    const numUsers = parseFloat(document.getElementById('numUsers').value);
    const avgCallsPerDay = parseFloat(document.getElementById('avgCallPerDay').value);
    const avgCallDuration = parseFloat(document.getElementById('avgCallDuration').value);
    const avgCallDurationUnit = document.getElementById('avgCallDurationUnit').value;
    const probCallDropped = parseFloat(document.getElementById('probCallDropped').value);
    const minSIR = parseFloat(document.getElementById('minSIR').value);
    const minSIRUnit = document.getElementById('minSIRUnit').value;
    const powerAtRefDist = parseFloat(document.getElementById('powerAtRefDistance').value);
    const powerAtRefDistUnit = document.getElementById('powerAtRefDistanceUnit').value;
    const refDistance = parseFloat(document.getElementById('refDistance').value);
    const refDistanceUnit = document.getElementById('refDistanceUnit').value; 
    const pathLossComponent = parseFloat(document.getElementById('pathLossComponent').value);
    const receiverSensitivity = parseFloat(document.getElementById('receiverSensitivity').value);
    const receiverSensitivityUnit = document.getElementById('receiverSensitivityUnit').value;

    // Conversion functions
    function convertToWatts(value, unit) {
        if (unit === 'dB' ) {
            return 10 ** (value / 10);
        }else if (unit === 'dBm') {
            return 10 ** (value-30 / 10);
        } 
        else if (unit === 'uW') {
            return value / 1e6;
        } else if (unit === 'mW') {
            return value / 1e3;
        } else {
            return value;
        }
    }

    function convertToLinear(value, unit) {
        if (unit === 'dB' || unit === 'dBm') {
            return 10 ** (value / 10);
        } else {
            return value;
        }
    }

    function convertDurationToMinutes(duration, unit) {
        if (unit === 'hours') {
            return duration * 60;
        } else if (unit === 'seconds') {
            return duration / 60;
        } else {
            return duration;
        }
    }

    function convertTomsquare(area) {
        return area * Math.pow(10, 6);
    }
    
    function convertDistanceToMeters(distance, unit) {
        switch (unit) {
            case 'km':
                return distance * 1000; // Convert kilometers to meters
            case 'cm':
                return distance / 100; // Convert centimeters to meters
            default:
                return distance; // Assume meters if no conversion needed
        }
    }

    // Calculate values
    const powerAtRefDistWatts = convertToWatts(powerAtRefDist, powerAtRefDistUnit);
    const receiverSensitivityWatts = convertToWatts(receiverSensitivity, receiverSensitivityUnit);
    const cityAreainmsquare = convertTomsquare(cityArea);

    // Calculate maximum distance
    const maxDistance = convertDistanceToMeters(refDistance, refDistanceUnit) /( (receiverSensitivityWatts / powerAtRefDistWatts) ** (1 / pathLossComponent));

    // Calculate maximum cell size assuming hexagonal cells
    const maxCellSize = (3 * Math.sqrt(3) / 2) * (maxDistance ** 2);

    // Calculate the number of cells in the service area
    const numCells = Math.ceil(cityAreainmsquare / maxCellSize);

    // Calculate traffic load in the whole cellular system in Erlangs
    const avgCallDurationMinutes = convertDurationToMinutes(avgCallDuration, avgCallDurationUnit);
    const trafficLoadPerUser = (avgCallsPerDay * avgCallDurationMinutes) / (24 * 60); // in Erlangs
    const totalTrafficLoad = trafficLoadPerUser * numUsers; // in Erlangs

    // Calculate traffic load in each cell in Erlangs
    const cellTrafficLoad = totalTrafficLoad / numCells;

    // Calculate number of cells in each cluster (N)
    const minSIRLinear = convertToLinear(minSIR, minSIRUnit);
    const possibleNValues = [1, 3, 4, 7, 9, 12, 13, 16, 19, 21, 28];

    function calculateN(minSIRLinear, pathLossComponent) {
        for (const N of possibleNValues) {
            const calculatedSIR = ((Math.sqrt(3 * N)) ** pathLossComponent) / 6;
            if (calculatedSIR >= minSIRLinear) {
                return N;
            }
        }
        return -1; // If no suitable N value is found
    }

    const N = calculateN(minSIRLinear, pathLossComponent);
    if (N === -1) {
        alert("No suitable N value found for the given SIR and path loss component.");
        return;
    }

// Function to get Erlang B based on probability of call dropped and traffic load
function getErlangB(probCallDropped, trafficLoad) {
    // Example Erlang B table (replace with actual data)
    const erlangBTable = [
        [14, 0.02, 8],
        [13, 0.05, 8],
        [14, 0.05, 9],
        [16, 0.02, 9]
    ];

    // Round down trafficLoad to the nearest integer
    trafficLoad = Math.floor(trafficLoad);

    // Loop through the table to find a matching entry
    for (let i = 0; i < erlangBTable.length; i++) {
        const [channels, GOS, loadd] = erlangBTable[i];
        if (GOS === probCallDropped && loadd === trafficLoad) {
            return channels;
        }
    }

    return -1;
}

    const numChannels = getErlangB(probCallDropped, cellTrafficLoad);
    if (numChannels === -1) {
        alert("No suitable number of channels found for the given GOS and traffic load.");
        return;
    }

    // Calculate minimum number of carriers needed
    const numCarriersNeeded = Math.ceil(numChannels / slotsPerCarrier);
    const totalNumCarriers = numCarriersNeeded * N;


    numChannelsaf = getErlangB(0.05, cellTrafficLoad);
    // Calculate minimum number of carriers needed
    const numCarriersNeededafterGos = Math.ceil(numChannelsaf / slotsPerCarrier);
    const totalNumCarriersafterGos = numCarriersNeededafterGos * N;

    // Display results
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <p>Maximum Distance between Transmitter and Receiver for Reliable Communication: <span class="result-value">${maxDistance.toFixed(2)} meters</span></p>
        <p>Maximum Cell Size: <span class="result-value">${maxCellSize.toFixed(2)} m²</span></p>
        <p>Number of Cells in the Service Area: <span class="result-value">${numCells} cells</span></p>
        <p>Traffic Load in the Whole Cellular System: <span class="result-value">${totalTrafficLoad.toFixed(2)} Erlangs</span></p>
        <p>Traffic Load in Each Cell: <span class="result-value">${cellTrafficLoad.toFixed(2)} Erlangs</span></p>
        <p>Number of Cells in Each Cluster: <span class="result-value">${N}</span></p>
        <p>Minimum Number of Carriers Needed (in the whole system ): <span class="result-value">${totalNumCarriers} carriers</span></p>
        <p>Minimum Number of Carriers Needed if the GOS is changed to 5%: <span class="result-value">${totalNumCarriersafterGos} carriers</span></p>

    `;
}
