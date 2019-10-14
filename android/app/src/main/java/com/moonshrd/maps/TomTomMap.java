package com.moonshrd.maps;

import android.content.Context;
import android.util.AttributeSet;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;

public class TomTomMap extends MapView implements OnMapReadyCallback {

    GoogleMap googleMap;
    Boolean isMapReady = false;
    public TomTomMap(Context context) {
        super(context);
    }

    public TomTomMap(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }

    public TomTomMap(Context context, AttributeSet attributeSet, int i) {
        super(context, attributeSet, i);
    }

    public TomTomMap(Context context, GoogleMapOptions googleMapOptions) {
        super(context, googleMapOptions);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        isMapReady = true;
        this.googleMap = googleMap;
     //   reactNativeEvent("onMapReady", null);
     //   LatLng mapCenter = new LatLng(_center.getDouble("lat"), _center.getDouble("lng"));
     //   tomtomMap.centerOn(CameraPosition.builder(mapCenter).zoom(_zoom).build());
     //   drawMarkers();
    }
}
