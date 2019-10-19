package com.moonshrd.models.maps

import com.google.gson.annotations.SerializedName

data class RoomPin( @SerializedName("roomID")
                    var roomID: String? = null,
                    @SerializedName("gps.lat")
                    var lat: String? = null,
                    @SerializedName("gps.lon")
                    var lng: String? = null)