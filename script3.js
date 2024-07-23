function calculateLinkMargin() {
    const c = 3 * 10**8; // Speed of light

    // Get input values
    let pathLoss = parseFloat(document.getElementById('pathLoss').value) || 0;
    const pathLossUnit = document.getElementById('pathLossUnit').value;

    let frequency = parseFloat(document.getElementById('frequency').value);
    const frequencyUnit = document.getElementById('frequencyUnit').value;

    const distance = parseFloat(document.getElementById('distance').value) || 0;

    let dataRate = parseFloat(document.getElementById('dataRate').value) || 1 ;
    const dataRateUnit = document.getElementById('dataRateUnit').value;

    let transmitGain = parseFloat(document.getElementById('transmitGain').value) || 0;
    const transmitGainUnit = document.getElementById('transmitGainUnit').value;

    let receiveGain = parseFloat(document.getElementById('receiveGain').value) || 0;
    const receiveGainUnit = document.getElementById('receiveGainUnit').value;

    let transmitAmplifierGain = parseFloat(document.getElementById('transmitAmplifierGain').value) || 0;
    const transmitAmplifierGainUnit = document.getElementById('transmitAmplifierGainUnit').value;

    let receiveAmplifierGain = parseFloat(document.getElementById('receiveAmplifierGain').value) || 0;
    const receiveAmplifierGainUnit = document.getElementById('receiveAmplifierGainUnit').value;

    let feederLoss = parseFloat(document.getElementById('feederLoss').value) || 0;
    const feederLossUnit = document.getElementById('feederLossUnit').value;

    let otherLosses = parseFloat(document.getElementById('otherLosses').value) || 0;
    const otherLossesUnit = document.getElementById('otherLossesUnit').value;

    let fadeMargin = parseFloat(document.getElementById('fadeMargin').value) || 0;
    const fadeMarginUnit = document.getElementById('fadeMarginUnit').value;

    let noiseFigure = parseFloat(document.getElementById('noiseFigure').value) || 0;
    const noiseFigureUnit = document.getElementById('noiseFigureUnit').value;

    const noiseTemperature = parseFloat(document.getElementById('noiseTemperature').value) || 1;

    let linkMargin = parseFloat(document.getElementById('linkMargin').value) || 0;
    const linkMarginUnit = document.getElementById('linkMarginUnit').value;

    const modulationType = document.getElementById('modulationType').value;
    const bitErrorRate = parseFloat(document.getElementById('bitErrorRate').value);
    
    // Function to convert to dB
    function toDb(value, unit) {
        if (unit === 'Unitless') {
            return 10 * Math.log10(value);
        } else if (unit === 'dBm') {
            return value - 30;
        } else {
            return value; // Already in dB
        }
    }

    // Convert all inputs to dB
    pathLoss = toDb(pathLoss, pathLossUnit);
    transmitGain = toDb(transmitGain, transmitGainUnit);
    receiveGain = toDb(receiveGain, receiveGainUnit);
    transmitAmplifierGain = toDb(transmitAmplifierGain, transmitAmplifierGainUnit);
    receiveAmplifierGain = toDb(receiveAmplifierGain, receiveAmplifierGainUnit);
    feederLoss = toDb(feederLoss, feederLossUnit);
    otherLosses = toDb(otherLosses, otherLossesUnit);
    fadeMargin = toDb(fadeMargin, fadeMarginUnit);
    noiseFigure = toDb(noiseFigure, noiseFigureUnit);
    linkMargin = toDb(linkMargin, linkMarginUnit);

    // Calculate path loss if not given
    if (!pathLoss && frequency && distance) {
        pathLoss = 10 * Math.log10((4 * Math.PI * frequency * distance)**2 / (c**2));
    }

    // Calculate EB/N0 in dB
    let ebN0 = 0;
            
    if (modulationType === '8-PSK') {
        switch(bitErrorRate) {
            case 1e-4:
                ebN0 = 12;
                break;
            case 1e-6:
                ebN0 = 14;
                break;
            case 1e-2:
                ebN0 = 7;
                break;
            case 1e-5:
                ebN0 = 13;
                break;
            case 1e-3:
                ebN0 = 10;
                break;        
        }
    } else if (modulationType === 'BPSK' || modulationType === 'QPSK') {
        switch(bitErrorRate) {
            case 1e-4:
                ebN0 = 8;
                break;
            case 1e-6:
                ebN0 = 10.5;
                break;
            case 1e-2:
                ebN0 = 4;
                break;
            case 1e-5:
                ebN0 = 9.8;
                break;
            case 1e-3:
                ebN0 = 7;
                break;        
        }
    } else if (modulationType === '16-PSK') {
        switch(bitErrorRate) {
            case 1e-4:
                ebN0 = 16;
                break;
            case 1e-6:
                ebN0 = 18;
                break;
            case 1e-2:
                ebN0 = 11;
                break;
            case 1e-5:
                ebN0 = 17;
                break;
            case 1e-3:
                ebN0 = 14;
                break;        
        }
    }

 
    const kindb = 10 * Math.log10(1.38 * 10**-23); // Boltzmann constant in dB
    const noiseTemperatureDb = 10 * Math.log10(noiseTemperature); // Convert noise temperature to dB
    const ebN0Db = ebN0; //  in dB

      // Calculate data rate in dB
    let rateindb;
    if (dataRateUnit === 'Kbps') {
        rateindb = 10 * Math.log10(dataRate * 1000);
    } else if (dataRateUnit === 'Mbps') {
        rateindb = 10 * Math.log10(dataRate * 1000000);
    } else {
        rateindb = 10 * Math.log10(dataRate);
    }


   const pt = linkMargin - transmitGain - receiveGain - transmitAmplifierGain - receiveAmplifierGain
    + pathLoss +feederLoss + otherLosses + fadeMargin + kindb + noiseTemperatureDb + noiseFigure +ebN0Db + rateindb;
    // Display results
    document.getElementById('resultContent').innerHTML = `
        <p>Power transmitted (Pt): <span class="result-value" onclick="toggleUnits(this)" data-unit="dB">${pt.toFixed(2)} dB</span></p>`;
}

function toggleUnits(element) {
    const value = parseFloat(element.innerText);
    const unit = element.getAttribute('data-unit');

    let newValue, newUnit;

    if (unit === 'dB') {
        // Convert dB to W
        if (value <= 0) {
            newValue = 10 ** (value / 10);
        } else {
            newValue = Math.pow(10, value / 10);
        }
        newUnit = 'W';
    } else if (unit === 'W') {
        // Convert W to dBm
        if (value <= 0) {
            newValue = value + 30;
        } else {
            newValue = 10 * Math.log10(value * 1000); // Convert W to mW and then to dBm
        }
        newUnit = 'dBm';
    } else if (unit === 'dBm') {
        // Convert dBm to dB
        newValue = value - 30;
        newUnit = 'dB';
    }

    // Handle precision and edge cases
    if (isNaN(newValue) || !isFinite(newValue)) {
        newValue = 0;
    }

    element.innerText = `${newValue.toFixed(2)} ${newUnit}`;
    element.setAttribute('data-unit', newUnit);
}