package com.moonshrd.models

import com.google.gson.annotations.SerializedName

data class MatchModel(@SerializedName("topic")
                      var topic: String,
                      @SerializedName("matrixID")
                      var matrixID: String,
                      @SerializedName("peerID")
                      var peerID: String,
                      @SerializedName("isValid")
                      var isValid: Boolean,
                      var userModel: UserModel)