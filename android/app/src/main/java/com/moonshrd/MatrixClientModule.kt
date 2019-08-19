package com.moonshrd

import com.facebook.react.bridge.*
import com.google.gson.Gson
import com.moonshrd.model.DirectChatModel
import java.lang.RuntimeException

class MatrixClientModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "MatrixClient"
    }

    @ReactMethod
    fun getDirectChats(promise: Promise) {
        val matrixInstance = Matrix.getInstance(reactApplicationContext)
        if(matrixInstance.defaultSession == null) {
            promise.reject(RuntimeException("Session must not be null!"))
        }
        val directChats = matrixInstance.defaultSession.dataHandler.store.rooms.filter {
            it.isDirect
        }

        for(i in 0 until 15) {
            if(!Globals.State.isInitialSyncComplete) {
                Thread.sleep(1000)
            }
            break
        }

        val chatModels = mutableListOf<DirectChatModel>()
        directChats.forEach { room ->
            val chat = DirectChatModel()
            chat.name = room.getRoomDisplayName(reactApplicationContext)
            chat.avatarUri = room.avatarUrl ?: ""
            val roomSummary = matrixInstance.defaultSession.dataHandler.store.getSummary(room.roomId)
            val contactID = roomSummary!!.heroes.filter {
                it != matrixInstance.defaultSession.myUserId
            }[0]
            val contact = matrixInstance.defaultSession.dataHandler.store.getUser(contactID)
            chat.lastSeen = contact.latestPresenceTs
            chat.isActive = contact.isActive
            chatModels.add(DirectChatModel())
        }
        val gson = Gson()
        promise.resolve(gson.toJson(chatModels))
    }
}