package com.moonshrd.services

import android.R
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.ConnectivityManager
import android.net.wifi.WifiManager
import android.os.Binder
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Arguments
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.moonshrd.MainActivity
import com.moonshrd.MainApplication
import com.moonshrd.models.LocalChat
import com.moonshrd.models.MatchModel
import com.moonshrd.models.MessageModel
import com.moonshrd.models.UserModel
import com.moonshrd.repository.LocalChatsRepository
import com.moonshrd.repository.MatchContactsRepository
import com.moonshrd.utils.TopicStorage
import com.moonshrd.utils.matrix.Matrix
import com.moonshrd.utils.matrix.MatrixSdkHelper
import com.moonshrd.utils.sendEventWithOneStringArg
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
    private val newMatchMemberEventName = "newMatchMemberEventName"
    private val newMessageEventName = "NewMessageEvent"
    private val newWifiEventName = "NewMatchEvent"

    private val CHANNEL_ID = "1250012"
    private val TAG = P2ChatService::class.java.simpleName

    private var currentWifiName = ""

    @Inject
    lateinit var gson: Gson
    @Inject
    lateinit var topicStorage: TopicStorage
    @Inject
    lateinit var matrixInstance: Matrix
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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val icon = BitmapFactory.decodeResource(resources, R.mipmap.sym_def_app_icon)

            val intent = Intent(this, MainActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT)

            val notificationBuilder: NotificationCompat.Builder = NotificationCompat.Builder(this, CHANNEL_ID)
            val notificationChannel = NotificationChannel(CHANNEL_ID, TAG, NotificationManager.IMPORTANCE_DEFAULT)
            notificationChannel.enableVibration(true)
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(notificationChannel)

            val notification = notificationBuilder
                    .setContentText("Service is start")
                    .setAutoCancel(true)
                    .setContentIntent(pendingIntent)
                    .setSmallIcon(R.mipmap.sym_def_app_icon).build()

            startForeground(1, notification)
        }
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
            try {  // Let no Exception reach the ScheduledExecutorService.
                if (isServiceRunning) {
                    getMessage()
                }
            } catch (e: Exception) {
                //  Logger.i("ERROR - ${e.message}")
            }
        }, 0, 500, TimeUnit.MILLISECONDS)

        scheduledExecutorService!!.scheduleAtFixedRate({
            if (isServiceRunning) {
                getMatch()
            }
        }, 0, 1, TimeUnit.SECONDS)

        scheduledExecutorService!!.scheduleAtFixedRate({
            if (isServiceRunning) {
                getWifiChat()
            }
        }, 0, 5, TimeUnit.SECONDS)

        isServiceRunning = true
        for (topic in topicStorage.getTopicList()) {
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
            LocalChatsRepository.getLocalChat(messageObject.topic)!!.putMessage(messageObject)
            val writableMap = Arguments.createMap()
            writableMap.putString("message", gson.toJson(messageObject))
            sendRNEvent(MainApplication.getReactContext(), newMessageEventName, writableMap)
        }
    }

    private fun getMatch() {
        val newMatch = P2mobile.getNewMatch()
        if (newMatch.isNotEmpty()) {
            val match = gson.fromJson(newMatch, MatchModel::class.java)
            if (match.isValid) {
                LocalChatsRepository.getLocalChat(match.topic)!!.putMember(match.matrixID)

                val directChats = matrixInstance.defaultSession.dataHandler.store.rooms.filter {
                    it.isDirect
                }

                directChats.forEach { room ->
                    val contactID = room.state.loadedMembers.filter {
                        it.userId != matrixInstance.defaultSession.myUserId
                    }[0].userId
                    if (match.matrixID == contactID) {
                        val roomSummary = room.roomSummary

                        val contact = matrixInstance.defaultSession.dataHandler.store.getUser(contactID)
                        val chat = UserModel(
                                contactID,
                                room.getRoomDisplayName(MainApplication.getReactContext()),
                                room.avatarUrl ?: "",
                                contact.latestPresenceTs,
                                contact.isActive,
                                matrixInstance.defaultLatestChatMessageCache.getLatestText(MainApplication.getReactContext(), roomSummary!!.roomId),
                                roomSummary.latestReceivedEvent.originServerTs,
                                roomSummary.latestReceivedEvent.mSentState.name,
                                roomSummary.mUnreadEventsCount,
                                roomId = room.roomId
                        )
                        MatchContactsRepository.addTopicUser(match.topic, chat)
                        match.userModel = MatchContactsRepository.getUser(chat.userId)
                    }
                }
                Logger.i("getMatch - ${gson.toJson(match)}")
                sendEventWithOneStringArg(MainApplication.getReactContext(), newMatchEventName, "match", gson.toJson(match))
            } else {
                LocalChatsRepository.getLocalChat(match.topic)!!.removeMember(match.matrixID)
            }
        }
    }

    private fun getWifiChat() {
        val wifiMgr = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        if (wifiMgr.isWifiEnabled) { // Wi-Fi adapter is ON
            val wifiInfo = wifiMgr.connectionInfo

            if (wifiInfo.networkId != -1) {
                // Connected to an access point
                val connectivityManager = applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
                val wifiName = connectivityManager.activeNetworkInfo.extraInfo
                if (currentWifiName != wifiName) {
                    currentWifiName = wifiName
                    //P2mobile.subscribeToTopic(currentWifiName)
                    LocalChatsRepository.addLocalChat(currentWifiName, LocalChat())
                }
            } else {
                // Not connected to an access point
                LocalChatsRepository.removeLocalChat(currentWifiName)
                currentWifiName = ""
            }
        } else {
            // Wi-Fi adapter is OFF
            LocalChatsRepository.removeLocalChat(currentWifiName)
            currentWifiName = ""
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
        if (isServiceRunning) {
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
