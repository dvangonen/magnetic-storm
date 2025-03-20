/**
 * Get latitude from search params
 */
export function getLatitudeFromSearchParams(): number | null {
	const searchParams = new URLSearchParams(window.location.search);
	const latitude = parseFloat(searchParams?.get('lat') ?? '');

	return isNaN(latitude) ? null : latitude;
}

/**
 * Draw latitude text
 */
export function drawLatitudeText(latitude: number): void {
	const latitudeText = document.getElementById('latitude') as HTMLElement;

	if (!latitudeText) {
		return;
	}

	latitudeText.innerText = `Зона активности бури: ${latitude}° геомагнитной широты`;
}

/**
 * Remove loading state
 */
export function removeLoadingState(): void {
	const loader = document.getElementById('loader') as HTMLElement;
	loader.remove();

	const content = document.getElementById('content') as HTMLElement;
	content.style.visibility = 'visible';
}
