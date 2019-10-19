package com.moonshrd.models

import com.moonshrd.models.UserModel
import org.matrix.androidsdk.rest.model.Event

data class MessageEventModel(val event: Event,val user:UserModel)