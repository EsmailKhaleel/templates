// Global variables
let currentImage = null;
let canvas = document.getElementById('imageCanvas');
let ctx = canvas.getContext('2d');
let originalImageData = null; let zoomLevel = 1;
let undoStack = [];
let redoStack = [];
let maxUndoSteps = 20;

// Image processing parameters
let adjustments = {
    brightness: 0,
    contrast: 0,
    exposure: 0,
    saturation: 0,
    vibrance: 0,
    hue: 0,
    highlights: 0,
    shadows: 0,
    grain: 0,
    noise: 0,
    clarity: 0,
    temperature: 0,
    tint: 0,
    sharpening: 0,
    blur: 0,
    vignette: 0,
    grainOpacity: 0
};        // Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
    document.getElementById('uploadArea').addEventListener('dragover', handleDragOver);
    document.getElementById('uploadArea').addEventListener('drop', handleDrop);

    // Attach event listeners to all adjustment sliders
    Object.keys(adjustments).forEach(param => {
        const slider = document.getElementById(param);
        if (slider) {
            slider.addEventListener('input', (e) => {
                adjustments[param] = parseFloat(e.target.value);
                document.getElementById(`${param}-value`).textContent = e.target.value;
                applyAdjustments();
            });
        }
    });
});

// Image Upload Handlers
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

// Image Loading
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            currentImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Update UI
            document.getElementById('placeholder').style.display = 'none';
            canvas.style.display = 'block';
            document.getElementById('imageSize').textContent = `${img.width} × ${img.height}`;
            document.getElementById('imageFormat').textContent = file.type;

            // Reset adjustments
            resetAdjustments();
            updateHistogram();
            fitToScreen();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Image Processing Functions
function applyAdjustments() {
    if (!currentImage) return;

    // Start with original image data
    ctx.putImageData(originalImageData, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Apply adjustments
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Basic adjustments
        // Brightness
        r += adjustments.brightness * 2.55;
        g += adjustments.brightness * 2.55;
        b += adjustments.brightness * 2.55;

        // Contrast
        const factor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;

        // Exposure
        const exposure = Math.pow(2, adjustments.exposure / 100);
        r *= exposure;
        g *= exposure;
        b *= exposure;

        // Temperature
        if (adjustments.temperature > 0) {
            r += adjustments.temperature * 2;
            b -= adjustments.temperature;
        } else {
            r -= Math.abs(adjustments.temperature);
            b += Math.abs(adjustments.temperature) * 2;
        }

        // Tint
        if (adjustments.tint > 0) {
            g += adjustments.tint * 2;
            b -= adjustments.tint;
        } else {
            g -= Math.abs(adjustments.tint);
            b += Math.abs(adjustments.tint) * 2;
        }

        // Advanced adjustments
        // Sharpening (simplified unsharp mask)
        if (adjustments.sharpening > 0) {
            const neighbors = getNeighborPixels(imageData, i / 4, canvas.width);
            const sharpenAmount = adjustments.sharpening / 100;
            r += (r - neighbors.r) * sharpenAmount;
            g += (g - neighbors.g) * sharpenAmount;
            b += (b - neighbors.b) * sharpenAmount;
        }

        // Noise reduction (simple box blur)
        if (adjustments.noise > 0) {
            const neighbors = getNeighborPixels(imageData, i / 4, canvas.width);
            const noiseAmount = adjustments.noise / 100;
            r = r * (1 - noiseAmount) + neighbors.r * noiseAmount;
            g = g * (1 - noiseAmount) + neighbors.g * noiseAmount;
            b = b * (1 - noiseAmount) + neighbors.b * noiseAmount;
        }

        // Clarity (local contrast)
        if (adjustments.clarity !== 0) {
            const clarityAmount = adjustments.clarity / 100;
            const luminance = (r + g + b) / 3;
            const clarityFactor = 1 + clarityAmount * (0.5 - Math.abs(luminance - 128) / 255);
            r *= clarityFactor;
            g *= clarityFactor;
            b *= clarityFactor;
        }

        // HSL - Hue adjustment
        if (adjustments.hue !== 0) {
            const hsl = rgbToHsl(r, g, b);
            hsl.h += adjustments.hue / 360;
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;
        }

        // Artistic effects
        // Vignette
        if (adjustments.vignette > 0) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
            const vignetteAmount = 1 - (distance / maxDistance) * (adjustments.vignette / 100);
            r *= vignetteAmount;
            g *= vignetteAmount;
            b *= vignetteAmount;
        }

        // Grain
        if (adjustments.grain > 0) {
            const grain = (Math.random() - 0.5) * adjustments.grain;
            r += grain;
            g += grain;
            b += grain;
        }

        // Blur
        if (adjustments.blur > 0) {
            const neighbors = getNeighborPixels(imageData, i / 4, canvas.width);
            const blurAmount = adjustments.blur / 100;
            r = r * (1 - blurAmount) + neighbors.r * blurAmount;
            g = g * (1 - blurAmount) + neighbors.g * blurAmount;
            b = b * (1 - blurAmount) + neighbors.b * blurAmount;
        }

        // Ensure values stay within bounds
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imageData, 0, 0);
    updateHistogram();
    saveToUndoStack();
}

// Helper function to get neighboring pixels' average values
function getNeighborPixels(imageData, index, width) {
    const x = index % width;
    const y = Math.floor(index / width);
    let rSum = 0, gSum = 0, bSum = 0, count = 0;

    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < imageData.height) {
                const i = (ny * width + nx) * 4;
                rSum += imageData.data[i];
                gSum += imageData.data[i + 1];
                bSum += imageData.data[i + 2];
                count++;
            }
        }
    }

    return {
        r: rSum / count,
        g: gSum / count,
        b: bSum / count
    };
}

// Color conversion helpers
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h, s, l };
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Transform Functions
function rotateImage(degrees) {
    if (!currentImage) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    if (Math.abs(degrees) === 90) {
        tempCanvas.width = canvas.height;
        tempCanvas.height = canvas.width;
    } else {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
    }

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(degrees * Math.PI / 180);
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);

    saveToUndoStack();
}

function flipImage(direction) {
    if (!currentImage) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    if (direction === 'horizontal') {
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(canvas, -canvas.width, 0);
    } else {
        tempCtx.scale(1, -1);
        tempCtx.drawImage(canvas, 0, -canvas.height);
    }

    ctx.drawImage(tempCanvas, 0, 0);
    saveToUndoStack();
}

// Histogram
function updateHistogram() {
    const histCanvas = document.getElementById('histogramCanvas');
    const histCtx = histCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Clear histogram
    histCtx.fillStyle = 'var(--bg-primary)';
    histCtx.fillRect(0, 0, histCanvas.width, histCanvas.height);

    // Calculate histogram data
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < imageData.length; i += 4) {
        const brightness = Math.round((imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3);
        histogram[brightness]++;
    }

    // Find maximum value for scaling
    const max = Math.max(...histogram);

    // Draw histogram
    histCtx.beginPath();
    histCtx.strokeStyle = 'var(--accent)';
    histCtx.lineWidth = 1;

    for (let i = 0; i < 256; i++) {
        const x = (i / 255) * histCanvas.width;
        const y = histCanvas.height - (histogram[i] / max) * histCanvas.height;

        if (i === 0) {
            histCtx.moveTo(x, y);
        } else {
            histCtx.lineTo(x, y);
        }
    }

    histCtx.stroke();
}

// Zoom Controls
function zoomIn() {
    zoomLevel = Math.min(5, zoomLevel + 0.1);
    updateZoom();
}

function zoomOut() {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    updateZoom();
}

function updateZoom() {
    const zoomPercent = Math.round(zoomLevel * 100);
    document.getElementById('zoomLevel').textContent = `${zoomPercent}%`;
    document.getElementById('currentZoom').textContent = `${zoomPercent}%`;
    canvas.style.transform = `scale(${zoomLevel})`;
}

function fitToScreen() {
    if (!currentImage) return;

    const container = document.querySelector('.canvas-container');
    const containerWidth = container.clientWidth - 80;
    const containerHeight = container.clientHeight - 80;

    const scaleX = containerWidth / canvas.width;
    const scaleY = containerHeight / canvas.height;
    zoomLevel = Math.min(scaleX, scaleY);

    updateZoom();
}

// Undo/Redo System
function saveToUndoStack() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push({
        imageData: imageData,
        adjustments: { ...adjustments }
    });

    if (undoStack.length > maxUndoSteps) {
        undoStack.shift();
    }

    redoStack = [];
}

function undo() {
    if (undoStack.length === 0) return;

    const currentState = {
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
        adjustments: { ...adjustments }
    };
    redoStack.push(currentState);

    const previousState = undoStack.pop();
    ctx.putImageData(previousState.imageData, 0, 0);
    adjustments = { ...previousState.adjustments };
    updateUIValues();
}

function redo() {
    if (redoStack.length === 0) return;

    const currentState = {
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
        adjustments: { ...adjustments }
    };
    undoStack.push(currentState);

    const nextState = redoStack.pop();
    ctx.putImageData(nextState.imageData, 0, 0);
    adjustments = { ...nextState.adjustments };
    updateUIValues();
}

// UI Updates
function updateUIValues() {
    Object.keys(adjustments).forEach(param => {
        const slider = document.getElementById(param);
        const valueDisplay = document.getElementById(`${param}-value`);
        if (slider && valueDisplay) {
            slider.value = adjustments[param];
            valueDisplay.textContent = adjustments[param];
        }
    });
}

function resetAdjustments() {
    Object.keys(adjustments).forEach(param => {
        adjustments[param] = 0;
    });
    updateUIValues();
    applyAdjustments();
}

// Reset everything to initial state
function resetAll() {
    if (!currentImage) return;

    // Reset all adjustments
    resetAdjustments();

    // Reset canvas to original image
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    ctx.drawImage(currentImage, 0, 0);

    // Reset zoom
    zoomLevel = 1;
    updateZoom();
    fitToScreen();

    // Reset crop
    cropRect = null;
    document.getElementById('cropSelection').style.display = 'none';
    document.getElementById('applyCropBtn').style.display = 'none';
    document.getElementById('cancelCropBtn').style.display = 'none';

    // Clear undo/redo stacks
    undoStack = [];
    redoStack = [];

    // Update histogram
    updateHistogram();
}

// Export Function
function downloadImage() {
    if (!currentImage) return;

    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Theme Toggle
function toggleTheme() {
    document.body.setAttribute('data-theme',
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
}

// Tab Switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content and activate tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Preset Filters
function applyPreset(preset) {
    switch (preset) {
        case 'vintage':
            adjustments.brightness = 10;
            adjustments.contrast = 10;
            adjustments.saturation = -20;
            adjustments.temperature = 15;
            break;
        case 'bw':
            adjustments.saturation = -100;
            adjustments.contrast = 20;
            break;
        case 'sepia':
            adjustments.temperature = 30;
            adjustments.saturation = -20;
            adjustments.brightness = 10;
            break;
        case 'cool':
            adjustments.temperature = -20;
            adjustments.tint = 10;
            break;
        case 'warm':
            adjustments.temperature = 20;
            adjustments.tint = -10;
            break;
        case 'dramatic':
            adjustments.contrast = 30;
            adjustments.clarity = 30;
            adjustments.shadows = -20;
            adjustments.highlights = -20;
            break;
    }

    updateUIValues();
    applyAdjustments();
}

// Initialize the app
function init() {
    canvas.style.display = 'none';
    document.getElementById('placeholder').style.display = 'flex';
    updateUIValues();
}

init();