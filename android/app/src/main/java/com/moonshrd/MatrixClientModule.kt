package com.moonshrd

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.moonshrd.model.DirectChatModel
import com.moonshrd.model.UserModel
import java9.util.concurrent.CompletableFuture
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.matrix.androidsdk.core.callback.ApiCallback
import org.matrix.androidsdk.core.model.MatrixError

class MatrixClientModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    val gson = Gson() // TODO Optimize it with Dagger
    val matrixInstance = Matrix.getInstance(reactApplicationContext)

    override fun getName(): String {
        return "MatrixClient"
    }

    @ReactMethod
    fun getDirectChats(promise: Promise) {
        GlobalScope.launch {
            if(matrixInstance.defaultSession == null) {
                promise.reject(RuntimeException("Session must not be null!"))
            }
            val directChats = matrixInstance.defaultSession.dataHandler.store.rooms.filter {
                it.isDirect
            }

            for(i in 0 until 15) {
                if(!Globals.State.isInitialSyncComplete) {
                    if(i == 14) {
                        promise.reject(RuntimeException("Sync waiting timeout!"))
                    }
                    Thread.sleep(1000)
                }
                break
            }

            val chatModels = mutableListOf<DirectChatModel>()
            directChats.forEach { room ->
                val roomSummary = matrixInstance.defaultSession.dataHandler.store.getSummary(room.roomId)
                val contactID = roomSummary!!.heroes.filter {
                    it != matrixInstance.defaultSession.myUserId
                }[0]
                val contact = matrixInstance.defaultSession.dataHandler.store.getUser(contactID)
                val chat = DirectChatModel(
                        room.getRoomDisplayName(reactApplicationContext),
                        room.avatarUrl ?: "",
                        contact.latestPresenceTs,
                        contact.isActive,
                        matrixInstance.defaultLatestChatMessageCache.getLatestText(reactApplicationContext, roomSummary.roomId)
                )
                chatModels.add(chat)
            }
            promise.resolve(gson.toJson(chatModels))
        }
    }

    @ReactMethod
    fun getUserById(userID: String, promise: Promise) {
        val userName: CompletableFuture<String?> = CompletableFuture()
        var userAvatarUrl: CompletableFuture<String?> = CompletableFuture()

        matrixInstance.defaultSession.profileApiClient.displayname(userID, object: ApiCallback<String> {
            override fun onSuccess(info: String?) {
                userName.complete(info!!)
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

        matrixInstance.defaultSession.profileApiClient.avatarUrl(userID,  object: ApiCallback<String> {
            override fun onSuccess(info: String?) {
                userAvatarUrl.complete(info!!)
                userAvatarUrl.complete(null)
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
            if(name != null) {
                promise.resolve(gson.toJson(UserModel(name, avatarUrl!!)))
            }
        }
    }


}