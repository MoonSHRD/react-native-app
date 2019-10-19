package com.moonshrd.maps

import com.google.android.gms.maps.MapView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext


class MapViewManager : SimpleViewManager<MapView>() {

    override fun getName(): String {
        return "MapViewManager"
    }

    override fun createViewInstance(context: ThemedReactContext): MapView {
        val map = MapView(context)
        map.onCreate(null)
        map.onResume()
        return map
    }
}
