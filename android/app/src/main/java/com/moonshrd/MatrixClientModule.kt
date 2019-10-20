package com.moonshrd

import android.location.Location
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.moonshrd.models.MessageEventModel
import com.moonshrd.models.MessageHistory
import com.moonshrd.models.UserModel
import com.moonshrd.repository.ContactsMatrixRepository
import com.moonshrd.utils.matrix.Matrix
import com.moonshrd.utils.matrix.MatrixSdkHelper
import com.moonshrd.utils.sendEventWithOneStringArg
import com.orhanobut.logger.Logger
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import java9.util.concurrent.CompletableFuture
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.matrix.androidsdk.core.callback.ApiCallback
import org.matrix.androidsdk.core.model.MatrixError
import org.matrix.androidsdk.data.Room
import org.matrix.androidsdk.data.RoomMediaMessage
import org.matrix.androidsdk.data.RoomState
import org.matrix.androidsdk.data.RoomSummary
import org.matrix.androidsdk.data.timeline.EventTimeline
import org.matrix.androidsdk.listeners.IMXMediaUploadListener
import org.matrix.androidsdk.rest.model.Event
import org.matrix.androidsdk.rest.model.TokensChunkEvents
import org.matrix.androidsdk.rest.model.search.SearchUsersResponse
import org.matrix.androidsdk.rest.model.sync.RoomResponse
import java.io.ByteArrayInputStream
import java.net.URLConnection.guessContentTypeFromStream
import javax.inject.Inject

class MatrixClientModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val eventListeners = HashMap<String, NewEventsListener>()

    @Inject
    lateinit var gson: Gson

    @Inject
    lateinit var matrixInstance: Matrix

    @Inject
    internal lateinit var api: API

    private lateinit var fusedLocationClient: FusedLocationProviderClient

    init {
        MainApplication.getComponent().inject(this)
    }

    override fun getName(): String {
        return "MatrixClient"
    }

    private fun isSessionExists(promise: Promise): Boolean {
        /*
        api.test().subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe( { result->
                    var kek = ""
                },{
                    var kek = ""
                })
         */
        if (matrixInstance.defaultSession == null) {
            promise.reject("NullSession", "Session must not be null!")
            return false
        }
        return true
    }

    @ReactMethod
    fun getDirectChats(promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }
        GlobalScope.launch {
            for (i in 0 until 15) {
                if (!Globals.State.isInitialSyncComplete) {
                    if (i == 14) {
                        promise.reject("onUnexpectedError", "Sync waiting timeout!")
                    }
                    Thread.sleep(1000)
                }
                break
            }
            val chats = getDirectChatsInternal()
            val chatsJson = gson.toJson(chats)
            promise.resolve(chatsJson)
        }
    }

    private fun getDirectChatsInternal(): List<UserModel> {

        ContactsMatrixRepository.removeAllContacts()
        val directChats = matrixInstance.defaultSession.dataHandler.store.rooms.filter {
            it.isDirect
        }
        //remove all contacts
        // MatchContactsRepository.removeAllContacts()

        val chatModels = mutableListOf<UserModel>()
        directChats.forEach { room ->
            val roomSummary = room.roomSummary

            // hack for optimization: since we hold the same listener, we will not create a useless instance of this listener (else it will add new object to internal list of listeners and messing up the memory)
            if (eventListeners[roomSummary!!.roomId] == null) {
                eventListeners[roomSummary.roomId] = NewEventsListener(reactApplicationContext, room, roomSummary)
            }
            room.timeline.addEventTimelineListener(eventListeners[room.roomId])
            // hack end
            val contactID = room.state.loadedMembers.filter {
                it.userId != matrixInstance.defaultSession.myUserId
            }[0].userId
            val contact = matrixInstance.defaultSession.dataHandler.store.getUser(contactID)
            val chat = UserModel(
                    contactID,
                    room.getRoomDisplayName(reactApplicationContext),
                    room.avatarUrl ?: "",
                    contact.latestPresenceTs,
                    contact.isActive,
                    matrixInstance.defaultLatestChatMessageCache.getLatestText(reactApplicationContext, roomSummary.roomId),
                    roomSummary.latestReceivedEvent.originServerTs,
                    roomSummary.latestReceivedEvent.mSentState.name,
                    roomSummary.mUnreadEventsCount,
                    roomId = room.roomId
            )
            chatModels.add(chat)
            ContactsMatrixRepository.addContact(chat)
        }
        return chatModels
    }

    @ReactMethod
    fun getUserById(userID: String, promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        val future = MatrixSdkHelper.getUserData(userID)

        future.thenAccept {
            promise.resolve(gson.toJson(it))
        }
        future.exceptionally {
            promise.reject(it)

            UserModel("", "", "") // crunch
        }
    }

    @ReactMethod
    fun getMyMxId(promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        promise.resolve(matrixInstance.defaultSession.myUserId)
    }

    @ReactMethod
    fun getMyProfile(promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        val currentSession = matrixInstance.defaultSession
        val httpUrlAvatar = currentSession.contentManager.getDownloadableUrl(currentSession.dataHandler.myUser.avatarUrl, false)
        promise.resolve(gson.toJson(UserModel(currentSession.myUserId,
                currentSession.dataHandler.myUser.displayname,
                currentSession.dataHandler.myUser.avatarUrl,
                avatarLink = httpUrlAvatar)))
    }

    @ReactMethod
    fun createDirectChat(participantUserId: String, promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        if (isDirectChatExists(participantUserId)) {
            val future = MatrixSdkHelper.getUserData(participantUserId)
            future.thenAccept {
                promise.resolve(gson.toJson(it))
            }
            future.exceptionally {
                promise.reject(it)

                UserModel("", "", "") // crunch
            }
            return
        }

        matrixInstance.defaultSession.createDirectMessageRoom(participantUserId, object : ApiCallback<String> {
            override fun onSuccess(roomId: String?) {
                promise.resolve(roomId)
            }

            override fun onUnexpectedError(e: java.lang.Exception?) {
                promise.reject("onUnexpectedError", e)
            }

            override fun onMatrixError(e: MatrixError?) {
                promise.reject("onMatrixError", e!!.message)
            }

            override fun onNetworkError(e: java.lang.Exception?) {
                promise.reject("onNetworkError", e)
            }
        })
    }

    private fun isDirectChatExists(participantUserId: String): Boolean {
        val directChats = getDirectChatsInternal()
        var exists = false
        directChats.forEach {
            if (it.userId == participantUserId) {
                exists = true
            }
        }
        return exists
    }

    @ReactMethod
    fun searchUserById(userName: String, limit: Int?, promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        val tempLimit: Int?
        if (limit == 0) {
            tempLimit = null
        } else {
            tempLimit = limit
        }

        val users = ArrayList<UserModel>()
        matrixInstance.defaultSession.searchUsers(userName, tempLimit, null, object : ApiCallback<SearchUsersResponse> {
            override fun onSuccess(info: SearchUsersResponse?) {
                info!!.results.forEach {
                    users.add(UserModel(it.user_id, it.displayname, it.avatarUrl))
                }
                promise.resolve(gson.toJson(users))
            }

            override fun onUnexpectedError(e: java.lang.Exception?) {
                promise.reject("onUnexpectedError", e!!.message)
            }

            override fun onMatrixError(e: MatrixError?) {
                promise.reject("onMatrixError", e!!.message)
            }

            override fun onNetworkError(e: java.lang.Exception?) {
                promise.reject("onNetworkError", e!!.message)
            }
        })
    }

    @ReactMethod
    fun updateDisplayName(newDisplayName: String, promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        matrixInstance.defaultSession.profileApiClient.updateDisplayname(newDisplayName, object : ApiCallback<Void> {
            override fun onSuccess(info: Void?) {
                promise.resolve(true)
            }

            override fun onUnexpectedError(e: java.lang.Exception?) {
                promise.reject("onUnexpectedError", e!!.message)
            }

            override fun onMatrixError(e: MatrixError?) {
                promise.reject("onMatrixError", e!!.message)
            }

            override fun onNetworkError(e: java.lang.Exception?) {
                promise.reject("onNetworkError", e!!.message)
            }
        })
    }

    @ReactMethod
    fun getLocation(promise: Promise) {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(reactApplicationContext)

        fusedLocationClient.lastLocation
                .addOnSuccessListener { location: Location? ->
                    // Got last known location. In some rare situations this can be null.
                    if (location != null) {
                        val locationParams = HashMap<String, String>()
                        locationParams["lat"] = location.latitude.toString()
                        locationParams["lng"] = location.longitude.toString()
                        promise.resolve(gson.toJson(locationParams))
                        Logger.i("LOCATION IS "+gson.toJson(locationParams))
                        return@addOnSuccessListener
                    } else {
                        promise.resolve(null)
                    }
                }.addOnFailureListener {
                    Logger.i(it.localizedMessage)
                    promise.reject(it)
                }
    }

    @ReactMethod
    fun updateAvatar(base64Avatar: String, promise: Promise) {
        if (!isSessionExists(promise)) {
            return
        }

        val future = uploadImage(base64Avatar)
        future.thenAccept {
            matrixInstance.defaultSession.profileApiClient.updateAvatarUrl(it, object : ApiCallback<Void> {
                override fun onSuccess(info: Void?) {
                    promise.resolve(true)
                }

                override fun onUnexpectedError(e: java.lang.Exception?) {
                    promise.reject("onUnexpectedError", e!!.message)
                }

                override fun onMatrixError(e: MatrixError?) {
                    promise.reject("onMatrixError", e!!.message)
                }

                override fun onNetworkError(e: java.lang.Exception?) {
                    promise.reject("onNetworkError", e!!.message)
                }
            })
        }
        future.exceptionally {
            promise.reject(it)
            ""
        }
    }

    private fun uploadImage(base64Image: String): CompletableFuture<String> {
        val imageByteArray = Base64.decode(base64Image, Base64.DEFAULT)
        val imageInputStream = ByteArrayInputStream(imageByteArray)
        val fileMimeType = guessContentTypeFromStream(imageInputStream)

        val future = CompletableFuture<String>()

        matrixInstance.defaultSession.mediaCache.uploadContent(imageInputStream, null, fileMimeType, null, object : IMXMediaUploadListener {
            override fun onUploadProgress(uploadId: String?, uploadStats: IMXMediaUploadListener.UploadStats?) {
                //
            }

            override fun onUploadCancel(uploadId: String?) {
                future.completeExceptionally(RuntimeException("onUploadCancel, uploadId=$uploadId"))
            }

            override fun onUploadStart(uploadId: String?) {
                //
            }

            override fun onUploadComplete(uploadId: String?, contentUri: String?) {
                future.complete(contentUri)
            }

            override fun onUploadError(uploadId: String?, serverResponseCode: Int, serverErrorMessage: String?) {
                future.completeExceptionally(RuntimeException("Error occurred! Response code=$serverResponseCode, error message=$serverErrorMessage"))
            }
        })
        return future
    }

    @ReactMethod
    fun sendMessage(message: String, roomId: String, promise: Promise) {
        val room = matrixInstance.defaultSession.dataHandler.getRoom(roomId)
        room.sendTextMessage(message, message, message, object : RoomMediaMessage.EventCreationListener {
            override fun onEventCreated(roomMediaMessage: RoomMediaMessage?) {
                promise.resolve(true)
            }

            override fun onEventCreationFailed(roomMediaMessage: RoomMediaMessage?, errorMessage: String?) {
                promise.reject("onEventCreationError", roomMediaMessage!!.text.toString())
            }

            override fun onEncryptionFailed(roomMediaMessage: RoomMediaMessage?) {
                promise.reject("onEncryptionError", roomMediaMessage!!.text.toString())
            }
        })
    }

    @ReactMethod
    fun getHistoryMessage(roomId: String, tokenMessageEnd: String, promise: Promise) {
        val room = matrixInstance.defaultSession.dataHandler.getRoom(roomId)

        matrixInstance.defaultSession.roomsApiClient.getRoomMessagesFrom(room.roomId, tokenMessageEnd, EventTimeline.Direction.BACKWARDS, 15, null, object : ApiCallback<TokensChunkEvents> {

            override fun onSuccess(info: TokensChunkEvents) {
                //it hack need because we can`t direct convert info to Json
                val messages = arrayListOf<MessageHistory>()

                val newInfo: HashMap<String, Any> = hashMapOf()

                for (i in info.chunk.indices) {
                    if (info.chunk[i].sender == getMyProfile().userId) {
                        val user = getMyProfile()
                        messages.add(MessageHistory(info.chunk[i].toJsonObject(), user))
                    } else {
                        val user = ContactsMatrixRepository.getUser(info.chunk[i].sender)
                        messages.add(MessageHistory(info.chunk[i].toJsonObject(), user!!))
                    }
                }

                newInfo["start"] = info.start
                newInfo["end"] = info.end
                newInfo["messages"] = messages

                val jsonMessages = gson.toJson(newInfo)
                promise.resolve(jsonMessages)
            }

            override fun onUnexpectedError(e: Exception) {
                promise.reject("onUnexpectedError", e.message)
            }

            override fun onNetworkError(e: Exception) {
                promise.reject("onNetworkError", e.message)
            }

            override fun onMatrixError(e: MatrixError) {
                promise.reject("onMatrixError", e.message)
            }
        })
    }

    @ReactMethod
    fun acceptInvite(roomId: String, promise: Promise) {
        matrixInstance.defaultSession.roomsApiClient.joinRoom(roomId, null, null, object : ApiCallback<RoomResponse> {
            override fun onSuccess(info: RoomResponse?) {
                val infoRoom = gson.toJson(info)
                promise.resolve(infoRoom)
            }

            override fun onUnexpectedError(e: Exception) {
                promise.reject("onUnexpectedError", e.message)

            }

            override fun onMatrixError(e: MatrixError) {
                promise.reject("onMatrixError", e.message)
            }

            override fun onNetworkError(e: java.lang.Exception) {
                promise.reject("onNetworkError", e.message)
            }
        })
    }

    private fun getHistoryMessageTest(roomId: String, tokenMessageEnd: String?) {
        val room = matrixInstance.defaultSession.dataHandler.getRoom(roomId)

        matrixInstance.defaultSession.roomsApiClient.getRoomMessagesFrom(room.roomId, tokenMessageEnd, EventTimeline.Direction.BACKWARDS, 15, null, object : ApiCallback<TokensChunkEvents> {

            override fun onSuccess(info: TokensChunkEvents) {
                val messages = arrayListOf<JsonObject>()

                val newInfo: HashMap<String, Any> = hashMapOf()

                for (i in info.chunk.indices) {
                    messages.add(info.chunk[i].toJsonObject())
                }

                newInfo["start"] = info.start
                newInfo["end"] = info.end
                newInfo["messages"] = messages

                matrixInstance.defaultSession.roomsApiClient.getRoomMessagesFrom(room.roomId, info.end, EventTimeline.Direction.BACKWARDS, 15, null, object : ApiCallback<TokensChunkEvents> {

                    override fun onSuccess(info: TokensChunkEvents) {

                    }

                    override fun onUnexpectedError(e: Exception) {
                    }

                    override fun onNetworkError(e: Exception) {
                    }

                    override fun onMatrixError(e: MatrixError) {
                    }
                })
            }

            override fun onUnexpectedError(e: Exception) {
            }

            override fun onNetworkError(e: Exception) {
            }

            override fun onMatrixError(e: MatrixError) {
            }
        })
    }

   private fun getMyProfile(): UserModel {
        val currentSession = matrixInstance.defaultSession
        val httpUrlAvatar = currentSession.contentManager.getDownloadableUrl(currentSession.dataHandler.myUser.avatarUrl, false)
        return UserModel(currentSession.myUserId,
                currentSession.dataHandler.myUser.displayname,
                currentSession.dataHandler.myUser.avatarUrl,
                avatarLink = httpUrlAvatar)
    }


    //can refactor with use dagger2
    internal class NewEventsListener(private val reactContext: ReactApplicationContext,
                                     private val room: Room,
                                     private val roomSummary: RoomSummary) : EventTimeline.Listener {
        private val matrixInstance = Matrix.getInstance(reactContext)

        fun getMyProfile(): UserModel {
            val currentSession = matrixInstance.defaultSession
            val httpUrlAvatar = currentSession.contentManager.getDownloadableUrl(currentSession.dataHandler.myUser.avatarUrl, false)
            return UserModel(currentSession.myUserId,
                    currentSession.dataHandler.myUser.displayname,
                    currentSession.dataHandler.myUser.avatarUrl,
                    avatarLink = httpUrlAvatar)
        }

        override fun onEvent(event: Event?, direction: EventTimeline.Direction?, roomState: RoomState?) {
            event?.let {
                matrixInstance.defaultLatestChatMessageCache.updateLatestMessage(reactContext, room.roomId, event.contentAsJsonObject?.get("body")?.asString)
                roomSummary.setLatestReceivedEvent(event, roomState)
                val gson = Gson()
                if (getMyProfile().userId == event.sender) {
                    val message = MessageEventModel(event, getMyProfile())
                    val msg = gson.toJson(message)
                    sendEventWithOneStringArg(reactContext, "eventMessage", "message", msg)
                } else {
                    val user = MatrixSdkHelper.getUserData(event.sender).get()
                    val message = MessageEventModel(event, user)
                    val msg = gson.toJson(message)
                    sendEventWithOneStringArg(reactContext, "eventMessage", "message", msg)
                }
            }
        }
    }
}