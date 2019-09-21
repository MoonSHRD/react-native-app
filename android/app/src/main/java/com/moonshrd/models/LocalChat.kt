package com.moonshrd.models

import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.LinkedHashMap

class LocalChat {
    private val messages = Collections.synchronizedMap(LinkedHashMap<String, Message>())
    private val members = ArrayList<String>() // MatrixIDs/MultiAddress

    fun putMessage(message: Message) {
        messages[message.id] = message
    }

    fun getChatHistory(): List<Message> {
        return ArrayList<Message>(messages.values).reversed()
    }

    /**
     * Get 15 messages before paginationToken
     */
    fun getHistoryMessages(paginationToken: String): List<Message> {
        val messagesChunk = ArrayList<Message>()
        val iterator = LinkedList(messages.entries).listIterator()
        var foundFromFlag = false // flag to indicate when we found message before which we should collect historical messages
        var messageCount = 0
        while(iterator.hasPrevious() && messageCount < 15) {
            val previousValue = iterator.previous()
            if(previousValue.key == paginationToken && !foundFromFlag) {
                foundFromFlag = true
                continue
            }

            if(foundFromFlag) {
                messagesChunk.add(previousValue.value)
                messageCount++
            }
        }
        return messagesChunk
    }

    fun putMember(id: String) {
        members.add(id)
    }

    fun getMembers(): List<String> {
        return members
    }
}