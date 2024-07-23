function calculateLTE() {
    // Get input values
    let rbBandwidth = parseFloat(document.getElementById('resourceBlockBandwidth').value);
    const rbBandwidthUnit = document.getElementById('rbBandwidthUnit').value;
    let subCarrierSpacing = parseFloat(document.getElementById('subCarrierSpacing').value);
    const subCarrierSpacingUnit = document.getElementById('subCarrierSpacingUnit').value;
    let ofdmSymbolsPerRB = parseInt(document.getElementById('ofdmSymbolsPerRB').value);
    let rbDuration = parseFloat(document.getElementById('rbDuration').value);
    const rbDurationUnit = document.getElementById('rbDurationUnit').value;
    let parallelRB = parseInt(document.getElementById('parallelRB').value);
    const qamType = parseInt(document.getElementById('qamType').value);

    const rbBandwidthHz = convertToHz(rbBandwidth, rbBandwidthUnit);
    const subCarrierSpacingHz = convertToHz(subCarrierSpacing, subCarrierSpacingUnit);

    // Validate that the ratio of rbBandwidth to subCarrierSpacing is an integer
    if (!Number.isInteger(rbBandwidthHz / subCarrierSpacingHz)) {
        alert("The ratio of Resource Block Bandwidth to Subcarrier Spacing must be an integer.");
        return;
    }

    // Validate QAM Type
    if (!isPowerOfTwo(qamType)) {
        alert("QAM Type must be a power of 2");
        return;
    }

    // Convert rbDuration to seconds if necessary
    rbDuration = convertToSeconds(rbDuration, rbDurationUnit);

    // Calculate number of bits per resource element
    const bitsPerRE = Math.floor(rbBandwidthHz / subCarrierSpacingHz);

    // Calculate number of bits per OFDM symbol
    const bitsPerSymbol = Math.log2(qamType) * bitsPerRE;

    // Calculate number of bits per OFDM resource block
    const bitsPerRB = bitsPerSymbol * ofdmSymbolsPerRB;

    // Calculate maximum transmission rate in bits per second
    let maxTransmissionRate = (bitsPerRB * parallelRB) / rbDuration;

    // Display results
    document.getElementById('resultContent').innerHTML = `
        <p class="result-item result-value">Number of Bits per Resource Element: ${bitsPerRE}</p>
        <p class="result-item result-value">Number of Bits per OFDM Symbol: ${bitsPerSymbol}</p>
        <p class="result-item result-value">Number of Bits per OFDM Resource Block: ${bitsPerRB}</p>
        <p class="result-item result-value" onclick="toggleUnit(this, ${maxTransmissionRate}, 'bps')">Maximum Transmission Rate: ${maxTransmissionRate.toLocaleString()} bps</p>
    `;
}

function toggleUnit(element, value, unit) {
    let newValue;
    let newUnit;

    switch (unit) {
        case 'bps':
            if (value >= 1e9) {
                newValue = value / 1e9;
                newUnit = 'Gbps';
            } else if (value >= 1e6) {
                newValue = value / 1e6;
                newUnit = 'Mbps';
            } else if (value >= 1e3) {
                newValue = value / 1e3;
                newUnit = 'kbps';
            } else {
                newValue = value;
                newUnit = 'bps';
            }
            break;
        case 'Gbps':
            newValue = value * 1e9;
            newUnit = 'bps';
            break;
        case 'Mbps':
            newValue = value * 1e6;
            newUnit = 'bps';
            break;
        case 'kbps':
            newValue = value * 1e3;
            newUnit = 'bps';
            break;
        default:
            newValue = value;
            newUnit = unit;
    }

    element.innerHTML = `Maximum Transmission Rate: ${newValue.toLocaleString()} ${newUnit}`;
    element.setAttribute('onclick', `toggleUnit(this, ${newValue}, '${newUnit}')`);
}

function convertToHz(value, unit) {
    switch (unit) {
        case 'kHz':
            return value * 1e3;
        case 'MHz':
            return value * 1e6;
        case 'GHz':
            return value * 1e9;
        default:
            return value; // Assuming it's already in Hz
    }
}

function convertToSeconds(value, unit) {
    switch (unit) {
        case 'ms':
            return value / 1000;
        case 'micros':
            return value / 1000000;
        default:
            return value;
    }
}

function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value > 0;
}
function calculateLTE() {
    // Get input values
    let rbBandwidth = parseFloat(document.getElementById('resourceBlockBandwidth').value);
    const rbBandwidthUnit = document.getElementById('rbBandwidthUnit').value;
    let subCarrierSpacing = parseFloat(document.getElementById('subCarrierSpacing').value);
    const subCarrierSpacingUnit = document.getElementById('subCarrierSpacingUnit').value;
    let ofdmSymbolsPerRB = parseInt(document.getElementById('ofdmSymbolsPerRB').value);
    let rbDuration = parseFloat(document.getElementById('rbDuration').value);
    const rbDurationUnit = document.getElementById('rbDurationUnit').value;
    let parallelRB = parseInt(document.getElementById('parallelRB').value);
    const qamType = parseInt(document.getElementById('qamType').value);

    // Convert bandwidth and subcarrier spacing to Hz if necessary
    const rbBandwidthHz = convertToHz(rbBandwidth, rbBandwidthUnit);
    const subCarrierSpacingHz = convertToHz(subCarrierSpacing, subCarrierSpacingUnit);

    // Validate that the ratio of rbBandwidth to subCarrierSpacing is an integer
    if (!Number.isInteger(rbBandwidthHz / subCarrierSpacingHz)) {
        alert("The ratio of Resource Block Bandwidth to Subcarrier Spacing must be an integer.");
        return;
    }

    // Validate QAM Type
    if (!isPowerOfTwo(qamType)) {
        alert("QAM Type must be a power of 2");
        return;
    }

    // Convert rbDuration to seconds if necessary
    rbDuration = convertToSeconds(rbDuration, rbDurationUnit);

    // Calculate number of bits per resource element
    const bitsPerRE = Math.floor(rbBandwidthHz / subCarrierSpacingHz);

    // Calculate number of bits per OFDM symbol
    const bitsPerSymbol = Math.log2(qamType) * bitsPerRE;

    // Calculate number of bits per OFDM resource block
    const bitsPerRB = bitsPerSymbol * ofdmSymbolsPerRB;

    // Calculate maximum transmission rate in bits per second
    let maxTransmissionRate = (bitsPerRB * parallelRB) / rbDuration;

    // Display results
    document.getElementById('resultContent').innerHTML = `
        <p class="result-item result-value">Number of Bits per Resource Element: ${bitsPerRE}</p>
        <p class="result-item result-value">Number of Bits per OFDM Symbol: ${bitsPerSymbol}</p>
        <p class="result-item result-value">Number of Bits per OFDM Resource Block: ${bitsPerRB}</p>
        <p class="result-item result-value" onclick="toggleUnit(this, ${maxTransmissionRate}, 'bps')">Maximum Transmission Rate: ${maxTransmissionRate.toLocaleString()} bps</p>
    `;
}

function toggleUnit(element, value, unit) {
    let newValue;
    let newUnit;

    switch (unit) {
        case 'bps':
            if (value >= 1e9) {
                newValue = value / 1e9;
                newUnit = 'Gbps';
            } else if (value >= 1e6) {
                newValue = value / 1e6;
                newUnit = 'Mbps';
            } else if (value >= 1e3) {
                newValue = value / 1e3;
                newUnit = 'kbps';
            } else {
                newValue = value;
                newUnit = 'bps';
            }
            break;
        case 'Gbps':
            newValue = value * 1e9;
            newUnit = 'bps';
            break;
        case 'Mbps':
            newValue = value * 1e6;
            newUnit = 'bps';
            break;
        case 'kbps':
            newValue = value * 1e3;
            newUnit = 'bps';
            break;
        default:
            newValue = value;
            newUnit = unit;
    }

    element.innerHTML = `Maximum Transmission Rate: ${newValue.toLocaleString()} ${newUnit}`;
    element.setAttribute('onclick', `toggleUnit(this, ${newValue}, '${newUnit}')`);
}

function convertToHz(value, unit) {
    switch (unit) {
        case 'kHz':
            return value * 1e3;
        case 'MHz':
            return value * 1e6;
        case 'GHz':
            return value * 1e9;
        default:
            return value; // Assuming it's already in Hz
    }
}

function convertToSeconds(value, unit) {
    switch (unit) {
        case 'ms':
            return value / 1000;
        case 'micros':
            return value / 1000000;
        default:
            return value;
    }
}

function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value > 0;
}
