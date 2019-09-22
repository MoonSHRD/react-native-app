package com.moonshrd.models

import com.google.gson.annotations.SerializedName

data class MessageModel(
    @SerializedName("Id")
    var id: String,
    @SerializedName("Body")
    var body: String,
    @SerializedName("From")
    var from: String,
    @SerializedName("Topic")
    var topic: String,
    @SerializedName("Timestamp")
    var timestamp: Long = 0,
    @SerializedName("User")
    var user: UserModel?
)



