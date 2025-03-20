import type { YMap, YMapLocationRequest } from 'ymaps3';
import { fetchCoords } from '../api/fetchCoords';

/**
 * Render map on the page
 */
export async function renderMap(): Promise<YMap> {
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
 * Start by fetching the coordinates from the API
 */
export async function renderCoords(
	mapPromise: Promise<YMap>,
	latitude: number
): Promise<void> {
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
