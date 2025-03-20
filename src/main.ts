import { renderMap, renderCoords } from './map';
import {
	getLatitudeFromSearchParams,
	drawLatitudeText,
	removeLoadingState,
} from './utils';
import './style.css';

/**
 * Initialize the application
 */
function init(): void {
	const latitude = getLatitudeFromSearchParams();

	if (latitude !== null) {
		drawLatitudeText(latitude);
	}

	const mapPromise = renderMap();

	if (latitude !== null) {
		renderCoords(mapPromise, latitude);
	}

	mapPromise.then(removeLoadingState);
}

init();
