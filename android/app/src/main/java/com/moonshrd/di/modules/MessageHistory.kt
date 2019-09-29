package com.moonshrd.di.modules

import com.google.gson.JsonObject
import com.moonshrd.models.UserModel

data class MessageHistory(val event: JsonObject, val user: UserModel)