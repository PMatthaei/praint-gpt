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

                const draw = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        point: true,
                    },
                });
                map.addControl(draw, 'top-left');

                draw.add(getData());

                map.on('draw.create', function (e) {
                    const coordinates = e.features[0].geometry.coordinates;
                    console.log("Point added at:", coordinates);
                });

                const popup = new maplibregl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                map.on('click', (e: MapMouseEvent) => {
                    console.log(e)
                    map.getCanvas().style.cursor = 'pointer';
                    popup.setLngLat(e.lngLat).setHTML("Test").addTo(map);
                });

                map.on('click', 'places', () => {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
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
