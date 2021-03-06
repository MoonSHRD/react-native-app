package com.moonshrd.models

import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.LinkedHashMap

class LocalChat {
    private val messages = Collections.synchronizedMap(LinkedHashMap<String, MessageModel>())
    private val members = ArrayList<String>() // MatrixIDs/MultiAddress

    fun putMessage(message: MessageModel) {
        messages[message.id] = message
    }

    fun getChatHistory(): List<MessageModel> {
        return ArrayList<MessageModel>(messages.values).reversed()
    }

    /**
     * Get 15 messages before paginationToken
     */
    fun getHistoryMessages(paginationToken: String?): List<MessageModel>? {
        if(paginationToken==null){
            val messagesChunk = ArrayList<MessageModel>()
            var messageCount = 0

            for ((key, value) in messages) {
                if(messageCount==16){
                 break
                }else{
                    messagesChunk.add(value)
                    messageCount++
                }
            }
            return messagesChunk
        }else{
            if(messages.isNotEmpty()) {
                val messagesChunk = ArrayList<MessageModel>()
                val iterator = LinkedList(messages.entries).listIterator(messages.entries.size-1)
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
        }
        return null
    }

    fun getLastMessage(): MessageModel? {
        return if(messages.entries.isNotEmpty()) {
            LinkedList(messages.entries).last().value
        } else {
            null
        }
    }

    fun putMember(id: String) {
        members.add(id)
    }

    fun removeMember(id: String) {
        members.remove(id)
    }

    fun getMembers(): List<String> {
        return members
    }
}