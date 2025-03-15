/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { coords } from './coords';

import html2canvas from 'html2canvas';
import './style.css';

function removeMapElements() {
	const selectors = [
		'#map > div > div.gm-style > div:nth-child(8) > button',
		'#map > div > div.gm-style > div:nth-child(13) > div > gmp-internal-camera-control',
		'#map > div > div.gm-style > div:nth-child(4) > div',
		'#map > div > div.gm-style > div:nth-child(13) > div > button',
	];

	selectors.forEach((selector) => {
		const element = document.querySelector(selector);
		if (element) {
			element.remove();
			console.log(`Element with selector '${selector}' removed.`);
		} else {
			console.log(`Element with selector '${selector}' not found.`);
		}
	});
}

// Example usage:
// Call this function when you want to remove the elements
// removeMapElements();

async function takeFullPageSnapshot(elementId = 'root', name = '') {
	try {
		const element = document.querySelector('#map');
		if (!element) {
			console.error(`Element with ID '${elementId}' not found.`);
			return;
		}
		removeMapElements();

		const canvas = await html2canvas(element, {
			useCORS: true, // Important for cross-origin images
			allowTaint: true, // May be needed for some external content
			scrollX: 0, // Ensure we start capturing from the left
			scrollY: 0, // Ensure we start capturing from the top
			windowWidth: element.clientWidth, // Capture the full width
			windowHeight: element.clientHeight, // Capture the full height
			onrendered: function (canvas) {
				document.body.appendChild(canvas);
			},
		});

		setTimeout(() => {
			const dataURL = canvas.toDataURL('image/png');

			// Create a download link
			const link = document.createElement('a');
			link.href = dataURL;
			link.download = `magnetic_storm_${name}.png`;

			// Trigger the download
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Clean up
		});

		console.log('Full page snapshot taken successfully.');
	} catch (error) {
		console.error('Error taking full page snapshot:', error);
	}
}

// Example usage:
// Call this function when you want to take the snapshot
// takeFullPageSnapshot(); // Uses 'root' as default element and 'fullpage-snapshot.png' as default filename
// takeFullPageSnapshot('my-container', 'my-snapshot.png'); // Example specifying element ID and filename

// This example creates a simple polygon representing the Bermuda Triangle.

function renderMap(name, coords): Promise<void> {
	return new Promise((resolve, reject) => {
		const map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: 60, lng: 49 },
			zoom: 4.8,
			mapTypeId: 'terrain',
			zoomControlOptions: {
				position: google.maps.ControlPosition.RIGHT_BOTTOM,
			},
		});

		// Define the LatLng coordinates for the polygon's path.
		const triangleCoords = coords.map((coord) => {
			return { lat: coord[1], lng: coord[0] };
		});

		// Construct the polygon.
		const bermudaTriangle = new google.maps.Polygon({
			paths: triangleCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
		});

		bermudaTriangle.setMap(map);

		// setTimeout(() => {
		// 	takeFullPageSnapshot('map', name);
		// 	resolve();
		// }, 5000);
	});
}

async function initMap() {
	for (let [key, value] of Object.entries(coords)) {
		await renderMap(key, value);
	}
}

declare global {
	interface Window {
		initMap: () => void;
	}
}
window.initMap = initMap;
export {};
