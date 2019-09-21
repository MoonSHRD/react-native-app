package com.moonshrd

import com.facebook.react.bridge.*
import com.google.gson.Gson
import com.moonshrd.models.LocalChat
import com.moonshrd.models.MessageModel
import com.moonshrd.models.UserModel
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
        MainApplication.getComponent().inject(this)
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
        val myId = matrixInstance.defaultSession?.myUserId ?: ""
        val myName = matrixInstance.defaultSession?.myUser!!.displayname ?: ""
        val myAvatarUrl = matrixInstance.defaultSession?.contentManager!!.getDownloadableUrl(matrixInstance.defaultSession?.dataHandler!!.myUser.avatarUrl,false)
        LocalChatsRepository.getLocalChat(topic)!!.putMessage(MessageModel(
                UUID.randomUUID().toString(),
                messageText,
                myId,
                topic,
                System.currentTimeMillis(),
                UserModel(
                        myId,
                        myName,
                        myAvatarUrl
                )
        ))

        promise.resolve(true)
    }

    @ReactMethod
    fun getLocalChatMembersByTopic(topic: String, promise: Promise) {
        promise.resolve(gson.toJson(LocalChatsRepository.getLocalChat(topic)!!.getMembers()))
    }

    @ReactMethod
    fun loadMoreMessages(topic: String, paginationToken: String, promise: Promise) {
        val messages = LocalChatsRepository.getLocalChat(topic)!!.getHistoryMessages(paginationToken)
        val map = HashMap<String, Any>()
        map["start"] = messages.first().id
        map["end"] = messages.last().id
        map["messages"] = messages
        promise.resolve(gson.toJson(map))
    }
}