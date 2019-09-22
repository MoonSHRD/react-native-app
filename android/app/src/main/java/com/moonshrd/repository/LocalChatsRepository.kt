package com.moonshrd.repository

import com.moonshrd.models.LocalChat
import java.util.*
import kotlin.collections.HashMap

object LocalChatsRepository {
    private val localChats = HashMap<String, LocalChat>()

    fun getAllLocalChats(): Map<String, LocalChat> {
        return localChats
    }

    fun addLocalChat(topic: String, localChat: LocalChat) {
        localChats[topic] = localChat
    }

    fun removeLocalChat(topic: String) {
        localChats.remove(topic)
    }

    fun getLocalChat(topic: String): LocalChat? {
        return localChats[topic]
    }
}