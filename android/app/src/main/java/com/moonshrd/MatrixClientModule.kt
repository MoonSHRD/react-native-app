package com.moonshrd

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.moonshrd.model.DirectChatModel
import java.lang.RuntimeException

class MatrixClientModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "MatrixClientModule"
    }

    @ReactMethod
    @Throws(RuntimeException::class)
    fun getDirectChats(): String {
        if(Globals.currMatrixSession == null) {
            throw RuntimeException()
        }
        val directChats = Globals.currMatrixSession.dataHandler.store.rooms.filter {
            it.isDirect
        }

        val chatModels = mutableListOf<DirectChatModel>()
        directChats.forEach { room ->
            val chat = DirectChatModel()
            chat.name = room.getRoomDisplayName(reactApplicationContext)
            chat.avatarUri = room.avatarUrl ?: ""
            val roomSummary = Globals.currMatrixSession.dataHandler.store.getSummary(room.roomId)
            val contactID = roomSummary!!.heroes.filter {
                it != Globals.currMatrixSession.myUserId
            }[0]
            val contact = Globals.currMatrixSession.dataHandler.store.getUser(contactID)
            chat.lastSeen = contact.latestPresenceTs
            chat.isActive = contact.isActive
            chatModels.add(DirectChatModel())
        }
        val gson = Gson()
        return gson.toJson(chatModels)
    }
}