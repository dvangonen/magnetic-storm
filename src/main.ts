import type { YMap, YMapLocationRequest } from 'ymaps3';
import { fetchCoords } from './api/fetchCoords';
import './style.css';

/**
 * Render map on the page
 */
async function renderMap() {
	const mapElement = document.getElementById('map') as HTMLElement;

	if (!mapElement) {
		throw new Error('Map element not found');
	}

	// Wait for the ymaps3 module to load
	await ymaps3.ready;

	const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

	const LOCATION: YMapLocationRequest = {
		center: [45, 55],
		zoom: 4.5,
	};

	const map = new YMap(mapElement, { location: LOCATION }, [
		new YMapDefaultSchemeLayer({}),
		new YMapDefaultFeaturesLayer({}),
	]);

	return map;
}

/**
 * Render polygon with coordinates on the map
 * @param map - map to render polygon on
 * @param coordinates - coordinates to render
 */
async function renderCoords(mapPromise: Promise<YMap>, latitude: number) {
	const [map, coordinates] = await Promise.all([
		mapPromise,
		fetchCoords(latitude),
	]);

	// If there are no coordinates, do nothing
	if (coordinates.length === 0) {
		return;
	}

	const { YMapFeature } = ymaps3;

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
function getLatitudeFromSearchParams(): number | null {
	const searchParams = new URLSearchParams(window.location.search);
	const latitude = parseFloat(searchParams?.get('lat') ?? '');

	return isNaN(latitude) ? null : latitude;
}

/**
 * Draw latitude text
 */
function drawLatitudeText(latitude: number): void {
	const latitudeText = document.getElementById('latitude') as HTMLElement;

	if (!latitudeText) {
		return;
	}

	latitudeText.innerText = `Зона активности бури: ${latitude}° геомагнитной широты`;
}

/**
 * Initialize the application
 */
async function init(): Promise<void> {
	const latitude = getLatitudeFromSearchParams();

	if (latitude !== null) {
		drawLatitudeText(latitude);
	}

	const mapPromise = renderMap();

	if (latitude !== null) {
		renderCoords(mapPromise, latitude);
	}
}

init();
