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
    fun subscribeToTopic(topic: String, promise: Promise) {
        MainApplication.getP2ChatService().subscribeToTopic(topic)
        promise.resolve(true)
    }

    @ReactMethod
    fun unsubscribeFromTopic(topic: String, promise: Promise) {
        MainApplication.getP2ChatService().unsubscribeFromTopic(topic)
        promise.resolve(true)
    }

    @ReactMethod
    fun getCurrentTopics(promise: Promise) {
        val topics = MainApplication.getP2ChatService().myTopics
        promise.resolve(gson.toJson(topics))
    }

    @ReactMethod
    fun getAllMatches(promise: Promise) {
        promise.resolve(gson.toJson(MainApplication.getP2ChatService().getAllMatches()))
    }

    @ReactMethod
    fun sendMessage(topic: String, messageText: String, promise: Promise) {
        MainApplication.getP2ChatService().sendMessage(topic, messageText)
        promise.resolve(true)
    }
}