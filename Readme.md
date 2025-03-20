# Magnetic Storm Map

This project visualizes geomagnetic storm activity on a map using the Yandex Maps API. It allows users to view storm activity zones based on latitude.

## Features

- Displays a map with geomagnetic storm activity zones.
- Fetches and renders polygon data for storm activity based on latitude.
- Dynamically updates the map and UI based on query parameters.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/magnetic-storm.git
   cd magnetic-storm
	```
	
2. Install deps

	```
	pnpm install
	```
3. Create a `.env`
VITE_MAP_API=<Your Yandex Maps API URL>

Development
To start the development server:

	```
	pnpm dev
	```

This will launch the app at http://localhost:3000.


## Usage
Open the app in your browser.

The map will display the storm activity zone for the specified latitude.

## Technologies Used
TypeScript: For type-safe JavaScript development.
Vite: For fast development and build tooling.
Yandex Maps API: For map rendering and data visualization.

## License
This project is licensed under the Apache 2.0 License.

## Acknowledgments
Yandex Maps API for providing mapping capabilities.