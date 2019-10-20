package com.moonshrd

import com.moonshrd.models.maps.RoomPin
import io.reactivex.Observable
import okhttp3.ResponseBody
import retrofit2.http.*


interface API {
    @GET("getRooms")
    fun getRooms(
            @Query("gps_lat") lat: String,
            @Query("gps_lon") lng: String,
            @Query("radius") radius: String
    ): Observable<RoomPin>

    @POST("putRoom")
    fun putRoom(
            @Query("gps_lat") country: String,
            @Query("gps_lon") appId: String,
            @Query("roomID") roomID: String,
            @Query("ttl") ttl: String
    ): Observable<String>

    @DELETE("removeRoom")
    fun removeRoom(@Query("id") roomID: String):Observable<String>

    @GET("/api/v1/employees")
    fun test():Observable<ResponseBody>

}