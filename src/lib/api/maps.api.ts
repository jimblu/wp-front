// src/lib/maps.ts

/**
 * Charge l'API Google Maps dynamiquement si nécessaire
 */
export function loadGoogleMaps(): Promise<void> {
	if ((window as any).google?.maps) {
		return Promise.resolve();
	}
	return new Promise<void>((resolve, reject) => {
		window.addEventListener(
			'maps-loaded',
			() => {
				resolve();
			},
			{ once: true }
		);
		setTimeout(() => reject(new Error('Google Maps loading timed out')), 10000);
	});
}

/**
 * Initialise et retourne une instance de Google Map
 */
export function initializeMap(container: HTMLDivElement): google.maps.Map {
	return new google.maps.Map(container, {
		mapId: 'f961cbbd6d9f59beee319d1b',
		center: { lat: 46.2276, lng: 2.2137 },
		zoom: 5,
		disableDefaultUI: true,
		cameraControl: true,
		restriction: {
			latLngBounds: {
				north: 53,
				south: 41.342327,
				west: -5.142222,
				east: 9.560016
			}
		}
	});
}

/**
 * Géocode une adresse (nom d'école + ville) et renvoie les coordonnées
 */
export async function locateSchool(
	school: string,
	city: string,
	country: string = 'FR'
): Promise<{ lat: number; lng: number }> {
	const geocoder = new google.maps.Geocoder();
	const res = await geocoder.geocode({
		address: `Collège ${school} ${city}`,
		componentRestrictions: { country }
	});
	if (!res.results || !res.results.length) {
		throw new Error('Location not found');
	}
	const loc = res.results[0].geometry.location;
	return { lat: loc.lat(), lng: loc.lng() };
}

/**
 * Crée un marqueur avancé sur la carte
 */
export function createMarker(
	map: google.maps.Map,
	position: { lat: number; lng: number },
	content?: HTMLElement
): google.maps.marker.AdvancedMarkerElement {
	return new google.maps.marker.AdvancedMarkerElement({
		map,
		position,
		content,
		gmpClickable: true
	});
}

/**
 * Crée une InfoWindow avec le HTML fourni
 */
export function createInfoWindow(
	map: google.maps.Map<Element>,
	marker: google.maps.marker.AdvancedMarkerElement,
	contentHtml: string
): void {
	const infowindow = new google.maps.InfoWindow({ content: contentHtml });
	new google.maps.InfoWindow({ content: contentHtml });
	marker.addListener('gmp-click', () => {
		infowindow.open({
			anchor: marker,
			map
		});
	});
}

export async function addSchool(
	map: google.maps.Map<Element>,
	school: string,
	city: string,
	teacher: string
) {
	const loc = await locateSchool(school, city);

	let img = document.createElement('img');
	img.style.paddingLeft = '30px';
	img.src = '/capeco-flag.svg';
	const marker = createMarker(map, { lat: loc.lat, lng: loc.lng }, img);

	const infoHtml = `
        <div class="gm-infowindow">
            <h2 class="gm-school">Collège ${school}</h2>
            <p class="gm-city">Professeur&nbsp;: ${teacher}</p>
            <p class="gm-city">${city}</p>
        </div>
    `;
	createInfoWindow(map, marker, infoHtml);
}
