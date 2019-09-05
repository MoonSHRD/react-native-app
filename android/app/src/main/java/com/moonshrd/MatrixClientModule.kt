package com.moonshrd

import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.moonshrd.model.UserModel
import com.moonshrd.utils.matrix.Matrix
import java9.util.concurrent.CompletableFuture
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.matrix.androidsdk.MXSession
import org.matrix.androidsdk.core.callback.ApiCallback
import org.matrix.androidsdk.core.model.MatrixError
import org.matrix.androidsdk.data.Room
import org.matrix.androidsdk.data.RoomState
import org.matrix.androidsdk.data.RoomSummary
import org.matrix.androidsdk.data.timeline.EventTimeline
import org.matrix.androidsdk.listeners.IMXMediaUploadListener
import org.matrix.androidsdk.rest.model.Event
import org.matrix.androidsdk.rest.model.search.SearchUsersResponse
import java.io.ByteArrayInputStream
import java.net.URLConnection.guessContentTypeFromStream


class MatrixClientModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val gson = Gson() // TODO Optimize it with Dagger
    private val matrixInstance = Matrix.getInstance(reactApplicationContext)
    private val eventListeners = HashMap<String, NewEventsListener>()
    private val currentSession: MXSession = matrixInstance.defaultSession

    override fun getName(): String {
        return "MatrixClient"
    }

    @ReactMethod
    fun getDirectChats(promise: Promise) {
        GlobalScope.launch {
            for(i in 0 until 15) {
                if(!Globals.State.isInitialSyncComplete) {
                    if(i == 14) {
                        promise.reject("onUnexpectedError", "Sync waiting timeout!")
                    }
                    Thread.sleep(1000)
                }
                break
            }

            promise.resolve(gson.toJson(getDirectChatsInternal()))
        }
    }

    private fun getDirectChatsInternal(): List<UserModel> {
        val directChats = currentSession.dataHandler.store.rooms.filter {
            it.isDirect
        }

        val chatModels = mutableListOf<UserModel>()
        directChats.forEach { room ->
            val roomSummary = room.roomSummary
            // hack for optimization: since we hold the same listener, we will not create a useless instance of this listener (else it will add new object to internal list of listeners and messing up the memory)
            if(eventListeners[roomSummary!!.roomId] != null) {
                eventListeners[roomSummary.roomId] = NewEventsListener(reactApplicationContext, room, roomSummary)
            }
            room.timeline.addEventTimelineListener(eventListeners[room.roomId])
            // hack end
            val contactID = room.state.loadedMembers.filter {
                it.userId != currentSession.myUserId
            }[0].userId
            val contact = currentSession.dataHandler.store.getUser(contactID)
            val chat = UserModel(
                    contactID,
                    room.getRoomDisplayName(reactApplicationContext),
                    room.avatarUrl ?: "",
                    contact.latestPresenceTs,
                    contact.isActive,
                    matrixInstance.defaultLatestChatMessageCache.getLatestText(reactApplicationContext, roomSummary.roomId),
                    roomSummary.latestReceivedEvent.originServerTs,
                    roomSummary.latestReceivedEvent.mSentState.name,
                    roomSummary.mUnreadEventsCount
            )
            chatModels.add(chat)
        }

        return chatModels
    }

    @ReactMethod
    fun getUserById(userID: String, promise: Promise) {
        val userName = CompletableFuture<String?>()
        val userAvatarUrl = CompletableFuture<String?>()

        currentSession.profileApiClient.displayname(userID, object: ApiCallback<String> {
            override fun onSuccess(info: String?) {
                userName.complete(info)
            }

            override fun onUnexpectedError(e: Exception?) {
                promise.reject(e)
                userName.complete(null)
            }

            override fun onMatrixError(e: MatrixError?) {
                //promise.reject(RuntimeException(e!!.error))
                userName.complete("")
            }

            override fun onNetworkError(e: Exception?) {
                promise.reject(e)
                userName.complete(null)
            }
        })

        currentSession.profileApiClient.avatarUrl(userID,  object: ApiCallback<String> {
            override fun onSuccess(info: String?) {
                userAvatarUrl.complete(info)
            }

            override fun onUnexpectedError(e: Exception?) {
                promise.reject(e)
                userAvatarUrl.complete(null)
            }

            override fun onMatrixError(e: MatrixError?) {
                //promise.reject(RuntimeException(e!!.error))
                userAvatarUrl.complete(null)
            }

            override fun onNetworkError(e: Exception?) {
                promise.reject(e)
                userAvatarUrl.complete(null)
            }
        })

        GlobalScope.launch {
            val name = userName.get()
            val avatarUrl = userAvatarUrl.get()
            if(name != null && avatarUrl != null) {
                promise.resolve(gson.toJson(UserModel(userID, name, avatarUrl)))
            } else {
                promise.resolve(gson.toJson(UserModel(userID, "", "")))
            }
        }
    }

    @ReactMethod
    fun getMyMxId(promise: Promise) {
        promise.resolve(currentSession.myUserId)
    }

    @ReactMethod
    fun getMyProfile(promise: Promise) {
        promise.resolve(gson.toJson(UserModel(currentSession.myUserId, currentSession.dataHandler.myUser.displayname, currentSession.dataHandler.myUser.avatarUrl)))
    }

    @ReactMethod
    fun createDirectChat(participantUserId: String, promise: Promise) {
        if(isDirectChatExists(participantUserId)) {
            promise.reject("directChatExists", "Direct chat with $participantUserId exists.")
            return
        }
        currentSession.createDirectMessageRoom(participantUserId, object : ApiCallback<String> {
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
            if(it.userId == participantUserId) {
                exists = true
            }
        }

        return exists
    }

    @ReactMethod
    fun searchUserById(userName: String, limit: Int?, promise: Promise) {
        val tempLimit: Int?
        if(limit == 0) {
            tempLimit = null
        } else {
            tempLimit = limit
        }

        val users = ArrayList<UserModel>()
        currentSession.searchUsers(userName, tempLimit, null, object: ApiCallback<SearchUsersResponse> {
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
        currentSession.profileApiClient.updateDisplayname(newDisplayName, object : ApiCallback<Void> {
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
    fun updateAvatar(base64Avatar: String, promise: Promise) {
        val future = uploadImage(base64Avatar)
        future.thenAccept {
            currentSession.profileApiClient.updateDisplayname(it, object : ApiCallback<Void> {
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

        val future = CompletableFuture<String>()

        currentSession.mediaCache.uploadContent(imageInputStream, null, guessContentTypeFromStream(imageInputStream), null, object: IMXMediaUploadListener {
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

    internal class NewEventsListener(private val reactContext: ReactApplicationContext,
                                     private val room: Room,
                                     private val roomSummary: RoomSummary): EventTimeline.Listener {
        private val matrixInstance = Matrix.getInstance(reactContext)
        override fun onEvent(event: Event?, direction: EventTimeline.Direction?, roomState: RoomState?) {
            if(event!!.type == Event.EVENT_TYPE_MESSAGE) {
                matrixInstance.defaultLatestChatMessageCache.updateLatestMessage(reactContext, room.roomId, event.contentAsJsonObject.get("body").asString)
                roomSummary.setLatestReceivedEvent(event, roomState)
            }
        }
    }
}