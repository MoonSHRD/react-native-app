package com.moonshrd.services

import android.app.Service
import android.content.Intent
import android.os.Binder
import android.os.IBinder
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.moonshrd.MainApplication
import com.moonshrd.models.Message
import com.moonshrd.utils.sendEvent
import p2mobile.P2mobile
import p2mobile.P2mobile.start
import java.util.*
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit
import javax.inject.Inject


class P2ChatService : Service() {
    private val newMatchEventName = "NewMatchEvent"

    @Inject
    private lateinit var gson: Gson
    private val binder = P2ChatServiceBinder()
    private var scheduledExecutorService: ScheduledExecutorService? = null

    val myTopics: List<String>
        get() {
            if (isServiceRunning) {
                val topicsJson = P2mobile.getTopics()
                val topicsArr = gson.fromJson(topicsJson, Array<String>::class.java)
                return listOf(*topicsArr)
            }
            onServiceIsNotRunning()
            return ArrayList()
        }

    override fun onCreate() {
        MainApplication.getComponent().injectsP2ChatService(this)
    }

    override fun onBind(intent: Intent): IBinder? {
        return binder
    }

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        onServiceStart(intent.getStringExtra("matrixID"))
        return START_NOT_STICKY
    }

    private fun onServiceStart(matrixID: String) {
        scheduledExecutorService = Executors.newSingleThreadScheduledExecutor()
        Thread { start(MainApplication.SERVICE_TOPIC, MainApplication.PROTOCOL_ID, "", 0) }.start()
        P2mobile.setMatrixID(matrixID)
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
    }


    private fun getMessage() {
        val message = P2mobile.getMessages()
        if (message.isNotEmpty()) {
            val messageObject = gson.fromJson(message, Message::class.java)
            Log.d(LOG_TAG, "New message! [${messageObject.topic}] ${messageObject.from} > ${messageObject.body})") // FIXME
        }
    }

    private fun getMatch() {
        val newMatch = P2mobile.getNewMatch()
        if (newMatch.isNotEmpty()) {
            val matchMapType = object : TypeToken<Map<String, List<String>>>() {}.type
            val match: Map<String, List<String>> = gson.fromJson(newMatch, matchMapType) // Pair of "MatrixID: Topics"

            val writableMap = Arguments.createMap()
            val writableArray = Arguments.createArray()
            match.map { mEntry ->
                mEntry.value.forEach {
                    writableArray.pushString(it)
                }
                writableMap.putArray(mEntry.key, writableArray)
            }

            sendEvent(MainApplication.getReactContext(), newMatchEventName, writableMap)
        }
    }

    /**
     * @return Pair of "Topic: MatrixIDs"
     */
    fun getAllMatches(): Map<String, List<String>> {
        if (isServiceRunning) {
            val matchesMapType = object : TypeToken<Map<String, List<String>>>() {}.type
            return gson.fromJson(P2mobile.getAllMatches(), matchesMapType)
        }
        return Collections.emptyMap()
    }

    inner class P2ChatServiceBinder : Binder() {
        val service: P2ChatService
            get() = this@P2ChatService
    }

    fun sendMessage(text: String) {
        if (isServiceRunning) {
            P2mobile.publishMessage(MainApplication.SERVICE_TOPIC, text + "\n")
        }
        onServiceIsNotRunning()
    }

    fun subscribeToTopic(topic: String) {
        if (isServiceRunning) {
            P2mobile.subscribeToTopic(topic)
        }
        onServiceIsNotRunning()
    }

    fun unsubscribeFromTopic(topic: String) {
        if (isServiceRunning) {
            P2mobile.unsubscribeFromTopic(topic)
        }
        onServiceIsNotRunning()
    }

    private fun onServiceIsNotRunning() {
        Log.e(LOG_TAG, "P2ChatService is not running!")
    }

    override fun onDestroy() {
        isServiceRunning = false
        scheduledExecutorService!!.shutdownNow()
    }

    companion object {
        private val LOG_TAG = "P2ChatService"
        var isServiceRunning = false
    }
}
