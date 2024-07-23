function calculate() {
    // Get input values
    let bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const quantizerBits = parseInt(document.getElementById('quantizerBits').value);
    const sourceEncoderRate = parseFloat(document.getElementById('sourceEncoderRate').value);
    const channelEncoderRate = parseFloat(document.getElementById('channelEncoderRate').value);
    const interleaverBits = parseInt(document.getElementById('interleaverBits').value);

    // Convert bandwidth to Hz if necessary
    if (bandwidthUnit === 'kHz') {
        bandwidth *= 1000;
    }

    // Perform calculations
    const samplingFrequency = 2 * bandwidth;
    const quantizationLevels = Math.pow(2, quantizerBits);
    const inputRate = samplingFrequency * quantizerBits;
    const sourceEncoderOutput = inputRate * sourceEncoderRate;
    const channelEncoderOutput = sourceEncoderOutput / channelEncoderRate;
    const interleaverOutput = channelEncoderOutput;

    // Display results
    document.getElementById('resultContent').innerHTML = `
        <p class="result-item" onclick="toggleUnit(this, ${samplingFrequency}, 'Hz')">Sampling Frequency: <span class="answer">${samplingFrequency.toLocaleString()} Hz</span></p>
        <p class="result-item">Number of Quantization Levels: <span class="answer">${quantizationLevels}</span></p>
        <p class="result-item" onclick="toggleUnit(this, ${sourceEncoderOutput}, 'bps')">Bit Rate at Source Encoder Output: <span class="answer">${sourceEncoderOutput.toLocaleString()} bps</span></p>
        <p class="result-item" onclick="toggleUnit(this, ${channelEncoderOutput}, 'bps')">Bit Rate at Channel Encoder Output: <span class="answer">${channelEncoderOutput.toLocaleString()} bps</span></p>
        <p class="result-item" onclick="toggleUnit(this, ${interleaverOutput}, 'bps')">Bit Rate at Interleaver Output: <span class="answer">${interleaverOutput.toLocaleString()} bps</span></p>
    `;
}

function toggleUnit(element, value, unit) {
    let newValue;
    let newUnit;

    switch(unit) {
        case 'Hz':
            newValue = value / 1000;
            newUnit = 'kHz';
            break;
        case 'kHz':
            newValue = value * 1000;
            newUnit = 'Hz';
            break;
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

    element.innerHTML = `${element.innerHTML.split(':')[0]}: <span class="answer">${newValue.toLocaleString()} ${newUnit}</span>`;
    element.setAttribute('onclick', `toggleUnit(this, ${newValue}, '${newUnit}')`);
}
