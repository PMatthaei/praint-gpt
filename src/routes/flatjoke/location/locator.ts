import {readable} from "svelte/store";
import type {GeoLocationResult} from "../../../model/core/geo-location";

export const location$ = readable<GeoLocationResult | undefined>(undefined,
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
