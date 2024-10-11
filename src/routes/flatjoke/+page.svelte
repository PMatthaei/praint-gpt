<script lang="ts">

    import {onDestroy, onMount} from "svelte";
    import maplibregl, {
        type AddLayerObject,
        type LngLatLike,
        type MapGeoJSONFeature,
        type StyleSpecification
    } from 'maplibre-gl';
    import MapboxDraw, {type MapMouseEvent} from '@mapbox/mapbox-gl-draw';
    import colors from 'tailwindcss/colors'
    import type {Feature} from "geojson";
    import {location$} from "./location/locator";
    import Modal from '../../components/Modal.svelte';

    // Fix: https://github.com/maplibre/maplibre-gl-js/issues/2601
    // @ts-ignore
    MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
    // @ts-ignore
    MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
    // @ts-ignore
    MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

    let map: maplibregl.Map

    const data: GeoJSON.FeatureCollection = {
        "type": "FeatureCollection",
        "features": []
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

    const getData = (): Array<Feature> => {
        return [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [11.55683908213743, 48.126501246936016]
                },
                "properties": {}
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [11.55714217175614, 48.12639740694223]
                },
                "properties": {}
            }
        ]
    }

    const createHomeIcon = (center: LngLatLike): maplibregl.Marker => {
        const markerElement = document.createElement('div');
        markerElement.innerHTML = '<i class="fas fa-map-marker-alt text-red-500 text-2xl"></i>'; // FontAwesome icon with Tailwind styles
        return new maplibregl.Marker(markerElement)
            .setLngLat(center) // Coordinates where the marker will be placed
    }

    const flatJokesLayer = 'flat-jokes-layer';
    const flatJokesSource = 'flat-jokes-source';

    let showModal = false;
    let jokeText = ``;

    const onSave = (feature: Feature) => {
        feature.properties = {
            ...feature.properties,
            joke: jokeText
        }
        data.features.push(feature)
        console.log(feature)
        map.getSource(flatJokesSource)?.setData(data)
    }

    onMount(() => {
        location$.subscribe(result => {
            const center: LngLatLike = result ? [result.coordinates.longitude, result.coordinates.latitude] : [11.55683908213743, 48.126501246936016]

            map = new maplibregl.Map({
                container: 'map',
                style: style,
                center: center,
                zoom: 18,
            });

            const popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            const homeIcon = createHomeIcon(center)
            homeIcon.addTo(map)

            const layer: AddLayerObject = {
                id: flatJokesLayer,
                type: 'circle',
                source: flatJokesSource,
                paint: {
                    'circle-radius': 10,
                    'circle-color': colors.blue['500']
                }
            }

            map.on('load', function () {

                map.addSource(flatJokesSource, {
                    type: 'geojson',
                    data: data
                });

                map.addLayer(layer);

                map.on('click', flatJokesLayer, function (ev: MapMouseEvent & {
                    features?: MapGeoJSONFeature[] | undefined;
                } & Object) {
                    popup.setLngLat(ev.lngLat).setHTML(ev.features!![0].properties.joke).addTo(map);
                });

                map.on('mouseenter', flatJokesLayer, function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', flatJokesLayer, function () {
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
                const feature = e.features[0]
                openModal(feature)
            });

        })

    });

    let modalData: Feature
    const openModal = (feature: Feature) => {
        modalData = feature
        showModal = true
    }

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

<Modal bind:showModal bind:data={modalData} onSave={(data) => onSave(data)}>
    <textarea bind:value={jokeText}
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            id="joke"
            placeholder="Enter your flat joke"
            maxlength="255"
    />
</Modal>
