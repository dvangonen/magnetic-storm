import type { LngLat, YMap, YMapLocationRequest } from 'ymaps3';
import './style.css';
import { fetchCoords } from './api/fetchCoords';

/**
 * Render map on the page
 */
function renderMap() {
	const mapElement = document.getElementById('map') as HTMLElement;

	if (!mapElement) {
		throw new Error('Map element not found');
	}

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
function renderCoordsPolygon(map: YMap, coordinates: LngLat[]) {
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
	let coordsPromise: Promise<LngLat[]> = Promise.resolve([]);

	if (latitude !== null) {
		drawLatitudeText(latitude);
		coordsPromise = fetchCoords(latitude);
	}

	await ymaps3.ready;
	const map = renderMap();

	const coords = await coordsPromise;
	renderCoordsPolygon(map, coords);
}

init();
