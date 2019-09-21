package com.moonshrd

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.moonshrd.models.LocalChat
import com.moonshrd.models.Message
import com.moonshrd.repository.LocalChatsRepository
import com.moonshrd.utils.TopicStorage
import com.moonshrd.utils.matrix.Matrix
import java.util.*
import javax.inject.Inject

class P2ChatModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    @Inject lateinit var gson: Gson
    @Inject lateinit var topicStorage: TopicStorage
    @Inject lateinit var matrixInstance: Matrix

    init {
        MainApplication.getComponent().injectsP2ChatModule(this)
    }

    override fun getName(): String {
        return "P2Chat"
    }

    @ReactMethod
    fun subscribeToTopic(topic: String, promise: Promise) {
        MainApplication.getP2ChatService().subscribeToTopic(topic)
        topicStorage.addTopic(topic)
        LocalChatsRepository.addLocalChat(topic, LocalChat())
        promise.resolve(topic)
    }

    @ReactMethod
    fun unsubscribeFromTopic(topic: String, promise: Promise) {
        MainApplication.getP2ChatService().unsubscribeFromTopic(topic)
        topicStorage.removeTopic(topic)
        LocalChatsRepository.removeLocalChat(topic)
        promise.resolve(true)
    }

    @ReactMethod
    fun getCurrentTopics(promise: Promise) {
        val topics = MainApplication.getP2ChatService().myTopics
        promise.resolve(gson.toJson(topics))
    }

    @ReactMethod
    fun sendMessage(topic: String, messageText: String, promise: Promise) {
        MainApplication.getP2ChatService().sendMessage(topic, messageText)
        val from = matrixInstance.defaultSession?.myUserId ?: ""
        LocalChatsRepository.getLocalChat(topic)!!.putMessage(Message(UUID.randomUUID().toString(), messageText, from, topic, System.currentTimeMillis()))
        promise.resolve(true)
    }

    @ReactMethod
    fun getLocalChatMembersByTopic(topic: String, promise: Promise) {
        promise.resolve(gson.toJson(LocalChatsRepository.getLocalChat(topic)!!.getMembers()))
    }

    @ReactMethod
    fun loadMoreMessages(topic: String, paginationToken: String, promise: Promise) {
        promise.resolve(gson.toJson(LocalChatsRepository.getLocalChat(topic)!!.getHistoryMessages(paginationToken)))
    }
}