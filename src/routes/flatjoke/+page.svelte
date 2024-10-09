<script lang="ts">

    import {onDestroy, onMount} from "svelte";
    import {readable} from "svelte/store";
    import maplibregl, {type StyleSpecification} from 'maplibre-gl';
    import MapboxDraw, {type MapMouseEvent} from '@mapbox/mapbox-gl-draw';

    let errorMessage: string | null = null;
    // Fix: https://github.com/maplibre/maplibre-gl-js/issues/2601
    // @ts-ignore
    MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
    // @ts-ignore
    MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
    // @ts-ignore
    MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

    interface Result {
        coordinates: GeolocationCoordinates,
        error: GeolocationPositionError | null
    }

    const style: StyleSpecification = {
        "version": 8,
        "sources": {
            "osm": {
                "type": "raster",
                "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": "&copy; OpenStreetMap Contributors",
                "maxzoom": 19
            }
        },
        "layers": [
            {
                "id": "osm",
                "type": "raster",
                "source": "osm" // This must match the source key above
            }
        ]
    };

    const getData = (): any => {
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [11.55683908213743, 48.126501246936016] // Example coordinates
                    },
                    "properties": {}
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [11.55714217175614, 48.12639740694223] // Example coordinates
                    },
                    "properties": {}
                }
            ]
        }
    }

    export const location$ = readable<Result | undefined>(undefined,
        function start(set) {
            const success = (position: GeolocationPosition) => {
                set({
                    coordinates: position.coords,
                    error: null,
                });
            }

            const error = (err: GeolocationPositionError) => {
                set({
                    coordinates: new GeolocationCoordinates(),
                    error: err,
                });
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                set({
                    coordinates: new GeolocationCoordinates(),
                    error: new GeolocationPositionError(),
                });
            }

            return function stop() {
                // You could add logic to stop watching geolocation (if using watchPosition)
            };
        }
    );

    onMount(() => {
        location$.subscribe(result => {
            if (result) {
                const map = new maplibregl.Map({
                    container: 'map',
                    style: style,
                    center: [result.coordinates.longitude, result.coordinates.latitude],
                    zoom: 18,
                });

                const popup = new maplibregl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                map.on('load', function () {
                    // Define a GeoJSON source with a point feature
                    const pointFeature: any = {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [11.55683908213743, 48.126501246936016]
                                },
                                properties: {
                                    title: 'My Point',
                                    description: 'This is a point feature added to a custom layer.'
                                }
                            }
                        ]
                    };

                    // Add the source for the point feature
                    map.addSource('my-point-source', {
                        type: 'geojson',
                        data: pointFeature
                    });

                    // Add a custom layer to display the point
                    map.addLayer({
                        id: 'my-point-layer',
                        type: 'circle',
                        source: 'my-point-source',
                        paint: {
                            'circle-radius': 10,
                            'circle-color': '#ff0000'
                        }
                    });

                    // Optionally, add a click event listener to the point feature
                    map.on('click', 'my-point-layer', function (e: any) {
                        const properties = e.features[0].properties;
                        alert(`You clicked on ${properties.title}: ${properties.description}`);
                    });

                    // Ensure the layer is visible
                    map.on('mouseenter', 'my-point-layer', function () {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    map.on('mouseleave', 'my-point-layer', function () {
                        map.getCanvas().style.cursor = '';
                    });
                });

                const draw = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        point: true,
                    },
                });
                map.addControl(draw, 'top-left');

                map.on('draw.create', function (e) {
                    const coordinates = e.features[0].geometry.coordinates;
                    console.log("Point added at:", coordinates);
                });

            }
        })

    });

    onDestroy(() => {

    });

</script>

<style>

</style>

<svelte:head>
    <title>Flat Joke Earth</title>
    <meta content="Flat Joke Earth" name="description"/>
</svelte:head>

<div id="map" class="flex flex-col gap-4 h-screen p-4 sm:ml-64">
</div>
