import type { LngLat } from 'ymaps3';

interface Response {
	coords: LngLat[];
}

async function fetchCoords(lat: number) {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_MAP_API}/coords?lat=${lat}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch coordinates');
		}

		const data: Response = await response.json();

		return data.coords;
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
		throw error;
	}
}

export { fetchCoords };
