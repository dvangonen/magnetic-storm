import type { LngLat, YMapLocationRequest } from 'ymaps3';
import './style.css';
import { fetchCoords } from './api/fetchCoords';

/**
 * Render map with coordinates
 * @param coordinates - coordinates to render
 */
async function renderMap(coordinates: LngLat[] | null): Promise<void> {
	const mapElement = document.getElementById('map') as HTMLElement;

	if (!mapElement) {
		return;
	}

	await ymaps3.ready;

	const LOCATION: YMapLocationRequest = {
		center: [45, 55],
		zoom: 4.5,
	};

	const {
		YMap,
		YMapDefaultSchemeLayer,
		YMapFeature,
		YMapDefaultFeaturesLayer,
	} = ymaps3;

	const map = new YMap(mapElement, { location: LOCATION }, [
		new YMapDefaultSchemeLayer({}),
		new YMapDefaultFeaturesLayer({}),
	]);

	if (!coordinates) {
		return;
	}

	const polygonFeature = new YMapFeature({
		id: 'polygon',
		geometry: {
			type: 'Polygon',
			coordinates: [coordinates],
		},
		style: {
			stroke: [{ width: 1, color: 'rgb(219, 14, 14)' }],
			fill: 'rgba(126, 30, 30, 0.5)',
		},
	});

	map.addChild(polygonFeature);
}

/**
 * Get latitude from search params
 */
function getLatitudeFromSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	const latitude = parseFloat(searchParams?.get('lat') ?? '');

	if (isNaN(latitude)) {
		return null;
	}

	return latitude;
}

/**
 * Initialize map with coordinates from search params
 */
async function initMap(latitude: number | null) {
	let coords: LngLat[] | null = null;

	try {
		if (latitude !== null) {
			coords = await fetchCoords(latitude);
		}
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
		coords = null;
	}

	renderMap(coords);
}

function drawLatitudeText(latitude: number) {
	const latitudeText = document.getElementById('latitude') as HTMLElement;

	if (!latitudeText) {
		return;
	}

	latitudeText.innerText = `Зона активности бури: ${latitude}° геомагнитной широты`;
}

function init() {
	const latitude = getLatitudeFromSearchParams();

	if (latitude) {
		drawLatitudeText(latitude);
	}

	initMap(latitude);
}

init();
