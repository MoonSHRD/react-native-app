package com.moonshrd

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.moonshrd.models.LocalChat
import com.moonshrd.models.LocalChatModel
import com.moonshrd.models.MessageModel
import com.moonshrd.models.UserModel
import com.moonshrd.repository.ContactRepository
import com.moonshrd.repository.LocalChatsRepository
import com.moonshrd.utils.TopicStorage
import com.moonshrd.utils.matrix.Matrix
import com.moonshrd.utils.matrix.MatrixSdkHelper
import com.orhanobut.logger.Logger
import java.util.*
import javax.inject.Inject
import kotlin.collections.ArrayList

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
    fun getLocalChatMembers(topic: String, promise: Promise) {
        val members = LocalChatsRepository.getLocalChat(topic)?.getMembers()
        val users = ArrayList<UserModel>()
        members?.forEach {
            users.add(MatrixSdkHelper.getUserData(it).get())
        }
         Log.d("testM", users.size.toString())
         Log.d("testM","m: "+ (members?.size ?: "NULL"))
        promise.resolve(gson.toJson(users))
    }

    @ReactMethod
    fun loadMoreMessages(topic: String, paginationToken: String?, promise: Promise) {
        val messages = LocalChatsRepository.getLocalChat(topic)!!.getHistoryMessages(paginationToken)
        val map = HashMap<String, Any?>()
        messages?.let {
            if(it.isNotEmpty()){
                map["start"] = it.first().id
                map["end"] = it.last().id
                map["messages"] = messages
            }
        }
        promise.resolve(gson.toJson(map))
    }

    @ReactMethod
    fun getLocalChats(promise: Promise) {
        val localChats = ArrayList<LocalChatModel>()
        LocalChatsRepository.getAllLocalChats().entries.forEach {
            val lastMessage = it.value.getLastMessage()
            localChats.add(LocalChatModel(it.key, lastMessage?.body ?: "", lastMessage?.id ?: "", lastMessage?.timestamp ?: 0))
        }
        promise.resolve(gson.toJson(localChats))
    }

    @ReactMethod
    fun getMatchedChats(promise: Promise){
        Logger.i("getMatchedChats call success")
        val contacts = ContactRepository.getAllContacts()
        promise.resolve(gson.toJson(contacts))
    }
}