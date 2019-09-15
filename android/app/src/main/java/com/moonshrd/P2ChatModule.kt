package com.moonshrd

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import javax.inject.Inject

class P2ChatModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    @Inject lateinit var gson: Gson

    init {
        MainApplication.getComponent().injectsP2ChatModule(this)
    }

    override fun getName(): String {
        return "P2Chat"
    }

    @ReactMethod
    public fun subcribeToTopic(topic: String, promise: Promise) {
        MainApplication.getP2ChatService().subscribeToTopic(topic)
        promise.resolve(true)
    }

    @ReactMethod
    public fun unsubscribeFromTopic(topic: String, promise: Promise) {
        MainApplication.getP2ChatService().unsubscribeFromTopic(topic)
        promise.resolve(true)
    }

    @ReactMethod
    public fun getCurrentTopics(promise: Promise) {
        val topics = MainApplication.getP2ChatService().myTopics
        promise.resolve(gson.toJson(topics))
    }
}