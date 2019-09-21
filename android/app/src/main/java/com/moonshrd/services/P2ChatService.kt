package com.moonshrd.services

import android.app.Service
import android.content.Intent
import android.os.Binder
import android.os.IBinder
import com.facebook.react.bridge.Arguments
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.moonshrd.MainApplication
import com.moonshrd.models.LocalChat
import com.moonshrd.models.MessageModel
import com.moonshrd.models.UserModel
import com.moonshrd.repository.LocalChatsRepository
import com.moonshrd.utils.TopicStorage
import com.moonshrd.utils.matrix.Matrix
import com.moonshrd.utils.matrix.MatrixSdkHelper
import com.moonshrd.utils.sendRNEvent
import com.orhanobut.logger.Logger
import p2mobile.P2mobile
import p2mobile.P2mobile.start
import java.util.*
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit
import javax.inject.Inject


class P2ChatService : Service() {
    private val newMatchEventName = "NewMatchEvent"
    private val newMessageEventName = "NewMessageEvent"

    @Inject lateinit var gson: Gson
    @Inject lateinit var topicStorage: TopicStorage
    @Inject lateinit var matrixInstance: Matrix
    private val binder = P2ChatServiceBinder()
    private var scheduledExecutorService: ScheduledExecutorService? = null

    val myTopics: List<String>
        get() {
            if (isServiceRunning) {
                val topicsJson = P2mobile.getTopics()
                val topicsArr = gson.fromJson(topicsJson, Array<String>::class.java)
                topicsArr ?: return emptyList()
                return topicsArr.toList()
            }
            onServiceIsNotRunning()
            return ArrayList()
        }

    override fun onCreate() {
        MainApplication.getComponent().inject(this)
    }

    override fun onBind(intent: Intent): IBinder? {
        return binder
    }

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        onServiceStart()
        return START_NOT_STICKY
    }

    private fun onServiceStart() {
        scheduledExecutorService = Executors.newSingleThreadScheduledExecutor()
        Thread {
            start(MainApplication.SERVICE_TOPIC, MainApplication.PROTOCOL_ID, "", 0)
            Logger.i("P2mobile started successfully!")
        }.start()
        P2mobile.setMatrixID("")
        scheduledExecutorService!!.scheduleAtFixedRate({
            if (isServiceRunning) {
                getMessage()
            }
        }, 0, 300, TimeUnit.MILLISECONDS)

        scheduledExecutorService!!.scheduleAtFixedRate({
            if (isServiceRunning) {
                getMatch()
            }
        }, 0, 1, TimeUnit.SECONDS)
        isServiceRunning = true
        for(topic in topicStorage.getTopicList()) {
            subscribeToTopic(topic)
            LocalChatsRepository.addLocalChat(topic, LocalChat())
        }
        Logger.i("Successfully subscribed to all topics which I have.")
    }


    private fun getMessage() {
        val message = P2mobile.getMessages()
        if (message.isNotEmpty()) {
            val messageObject = gson.fromJson(message, MessageModel::class.java)
            messageObject.timestamp = System.currentTimeMillis()
            messageObject.id = UUID.randomUUID().toString()
            val future = MatrixSdkHelper.getMinimalUserData(messageObject.from)
            val user = future.get() // FIXME may be blocking
            messageObject.user = UserModel(messageObject.from, user.name, user.avatarUrl)
            Logger.d("New message! [${messageObject.topic}] ${messageObject.from} > ${messageObject.body})")
            LocalChatsRepository.getLocalChat(messageObject.topic)!!.putMessage(messageObject)
            val writableMap = Arguments.createMap()
            writableMap.putString("message", gson.toJson(messageObject))
            sendRNEvent(MainApplication.getReactContext(), newMessageEventName, writableMap)
        }
    }

    private fun getMatch() {
        val newMatch = P2mobile.getNewMatch()
        if (newMatch.isNotEmpty()) {
            val matchMapType = object : TypeToken<Map<String, List<String>>>() {}.type
            val match: Map<String, List<String>> = gson.fromJson(newMatch, matchMapType) // Pair of "MatrixID: Topics"

            val writableMap = Arguments.createMap()
            val writableArray = Arguments.createArray()

            var isValidMatch = true

            match.map { mEntry ->
                if(mEntry.key.isNotEmpty()) { // TODO move empty mxid filtering to native (golang) part
                    mEntry.value.forEach {
                        writableArray.pushString(it)
                        LocalChatsRepository.getLocalChat(it)!!.putMember(mEntry.key)
                    }
                    writableMap.putArray(mEntry.key, writableArray)
                } else {
                    isValidMatch = false
                    return@map
                }
            }

            if(isValidMatch) {
                sendRNEvent(MainApplication.getReactContext(), newMatchEventName, writableMap)
            }
        }
    }

    /**
     * @return Pair of "Topic: MatrixID[]"
     */
    fun getAllMatches(): Map<String, List<String>>? {
        if (isServiceRunning) {
            val matchesMapType = object : TypeToken<Map<String, List<String>>>() {}.type
            val matchesJson = P2mobile.getAllMatches()
            return gson.fromJson(matchesJson, matchesMapType)
        }
        return Collections.emptyMap()
    }

    fun setMatrixID(matrixID: String) {
        if(isServiceRunning) {
            P2mobile.setMatrixID(matrixID)
        } else {
            onServiceIsNotRunning()
        }
    }

    inner class P2ChatServiceBinder : Binder() {
        val service: P2ChatService
            get() = this@P2ChatService
    }

    fun sendMessage(topic: String, text: String) {
        if (isServiceRunning) {
            P2mobile.publishMessage(topic, text + "\n")
        } else {
            onServiceIsNotRunning()
        }
    }

    fun subscribeToTopic(topic: String) {
        if (isServiceRunning) {
            P2mobile.subscribeToTopic(topic)
        } else {
            onServiceIsNotRunning()
        }
    }

    fun unsubscribeFromTopic(topic: String) {
        if (isServiceRunning) {
            P2mobile.unsubscribeFromTopic(topic)
        } else {
            onServiceIsNotRunning()
        }
    }

    private fun onServiceIsNotRunning() {
        Logger.e("P2ChatService is not running!")
    }

    override fun onDestroy() {
        isServiceRunning = false
        scheduledExecutorService!!.shutdownNow()
    }

    companion object {
        var isServiceRunning = false
    }
}
