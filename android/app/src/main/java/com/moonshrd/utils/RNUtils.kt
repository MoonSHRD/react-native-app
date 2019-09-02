package com.moonshrd.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReactContext

fun sendEvent(reactContext: ReactContext,
              eventName: String,
              params: WritableMap?) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
}

fun sendEventWithOneStringArg(reactContext: ReactContext, eventName: String, argName: String, arg: String?) {
    val args = Arguments.createMap()
    args.putString(argName, arg)
    sendEvent(reactContext, eventName, args)
}