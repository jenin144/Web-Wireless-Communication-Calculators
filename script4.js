function calculateThroughput() {
    // Get input values
    let bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const technique = document.getElementById('technique').value;
    let signalPropagation = parseFloat(document.getElementById('signalPropagation').value);
    const propagationUnit = document.getElementById('propagationUnit').value;
    let frameSize = parseFloat(document.getElementById('frameSize').value);
    const frameSizeUnit = document.getElementById('frameSizeUnit').value;
    let frameRate = parseFloat(document.getElementById('frameRate').value);
    const frameRateUnit = document.getElementById('frameRateUnit').value;

    // Convert bandwidth to bps if necessary
    switch(bandwidthUnit) {
        case 'Kbps':
            bandwidth *= 1e3;
            break;
        case 'Mbps':
            bandwidth *= 1e6;
            break;
        case 'Gbps':
            bandwidth *= 1e9;
            break;
    }

    // Convert signal propagation to seconds if necessary
    switch(propagationUnit) {
        case 'ms':
            signalPropagation *= 1e-3;
            break;
        case 'µs':
            signalPropagation *= 1e-6;
            break;
    }

    // Convert frame size to bits if necessary
    switch(frameSizeUnit) {
        case 'Kbits':
            frameSize *= 1e3;
            break;
    }

    // Convert frame rate to fps if necessary
    switch(frameRateUnit) {
        case 'Kfps':
            frameRate *= 1e3;
            break;
        case 'Mfps':
            frameRate *= 1e6;
            break;
    }

    // Calculate T
    const T = frameSize / bandwidth;

    // Calculate alpha
    const alpha = signalPropagation / T;

    // Calculate G
    const G = frameRate * T;

    // Calculate throughput (S) based on the selected technique
    let S = 0;
    let formula = '';

    switch(technique) {
        case 'unslottedNonpersistentCSMA':
            S = (G * Math.exp(-2 * alpha * T)) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
            formula = `S = (G * e^(-2 * alpha * T)) / (G * (1 + 2 * alpha) + e^(-alpha * G))`;
            break;
        case 'slottedNonpersistentCSMA':
            S = (alpha * G * Math.exp(-2 * alpha * T)) / (1 - Math.exp(-alpha * G) + alpha);
            formula = `S = (alpha * G * e^(-2 * alpha * T)) / (1 - e^(-alpha * G) + alpha)`;
            break;
        case 'slotted1PersistentCSMA':
            S = (G * (1 + alpha - Math.exp(-alpha * G) ) * Math.exp(-G * (1 + alpha))) / ((1 + alpha) * (1 - Math.exp(-alpha * G)) + (alpha * Math.exp(-G * (1 + alpha))));
            formula = `S = (G * (1 + alpha - e^(-alpha * G) )* e^(-G * (1 + alpha))) / ((1 + alpha) * (1 - e^(-alpha * G)) + (alpha * e^(-G * (1 + alpha))))`;
            break;
    }

    // Convert throughput to percentage
    const SPercentage = S * 100;

    // Display results
    document.getElementById('resultContent').innerHTML = `
        <p>Technique: <span class="result-value">${technique.replace(/([A-Z])/g, ' $1').trim()}</span></p>
        <p>Formula: <span class="result-value">${formula}</span></p>
        <p>Throughput (S): <span class="result-value">${S.toFixed(2)}</span></p>
        <p>Throughput (Percentage): <span class="result-value">${SPercentage.toFixed(2)}%</span></p>
    `;
}
