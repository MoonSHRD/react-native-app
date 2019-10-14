package com.moonshrd.maps

import com.google.android.gms.maps.MapView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;


class MapViewManager : SimpleViewManager<MapView>() {

    val REACT_CLASS = "MapViewAndroid"

    private val PROP_SHOWS_USER_LOCATION = "showsUserLocation"
    private val PROP_ROTATE_ENABLED = "rotateEnabled"
    private val PROP_SCROLL_ENABLED = "scrollEnabled"
    private val PROP_ZOOM_ENABLED = "zoomEnabled"

    val COMMAND_SET_CENTER_COORDINATE = 1
    val COMMAND_SET_ZOOM_LEVEL = 2
    val COMMAND_SET_CENTER_COORDINATE_ZOOM_LEVEL = 3

    private val LOG_TAG = "ReactNative"

    // the desired zoom level, in the range of 2.0 to 21.0. Values below this range are set to 2.0, and values above it are set to 21.0.
    // Increase the value to zoom in. Not all areas have tiles at the largest zoom levels.
    private val DEFAULT_ZOOM_LEVEL = 12.0f

    private var mMapLoaded = false

    override fun getName(): String {
        return "MapViewManager"
    }

    override fun createViewInstance(context: ThemedReactContext): MapView {
        val map = TomTomMap(context)
        map.onResume()
        return map
    }
}
