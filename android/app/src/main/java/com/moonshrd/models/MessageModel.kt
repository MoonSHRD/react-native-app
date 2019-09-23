package com.moonshrd.models

import com.google.gson.annotations.SerializedName

data class MessageModel(
        @SerializedName("Id")
        var id: String,
        @SerializedName("body")
        var body: String,
        @SerializedName("fromMatrixID")
        var from: String,
        @SerializedName("topic")
        var topic: String,
        @SerializedName("Timestamp")
        var timestamp: Long = 0,
        @SerializedName("User")
        var user: UserModel?,
        @SerializedName("fromPeerID")
        var fromPeerID: String?=null
)



