package com.moonshrd.utils.matrix

import com.google.gson.Gson
import com.moonshrd.MainApplication
import com.moonshrd.models.UserModel
import java9.util.concurrent.CompletableFuture
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.matrix.androidsdk.core.callback.ApiCallback
import org.matrix.androidsdk.core.model.MatrixError
import org.matrix.androidsdk.data.Room
import org.matrix.androidsdk.rest.model.User
import javax.inject.Inject

object MatrixSdkHelper {
    @Inject lateinit var matrixInstance: Matrix
    @Inject lateinit var gson: Gson

    init {
        MainApplication.getComponent().inject(this)
    }

    fun getUserData(userID: String): CompletableFuture<UserModel> {
        val result = CompletableFuture<UserModel>()
        val userName = CompletableFuture<String?>()
        val userAvatarUrl = CompletableFuture<String?>()
        val userIsActive = CompletableFuture<Boolean?>()
        val userLastSeen = CompletableFuture<Long?>()

        if(matrixInstance.defaultSession != null) {
            val directChats = matrixInstance.defaultSession.dataHandler.store.rooms.filter {
                it.isDirect
            }

            val roomId = getRoomId(directChats, userID)

            matrixInstance.defaultSession.presenceApiClient.getPresence(userID,object : ApiCallback<User> {
                override fun onSuccess(info: User?) {
                    userIsActive.complete(info?.isActive)
                    userLastSeen.complete(info?.lastActiveAgo)
                }

                override fun onUnexpectedError(e: java.lang.Exception?) {
                    userIsActive.complete(null)
                    userLastSeen.complete(null)
                }

                override fun onMatrixError(e: MatrixError?) {
                    userIsActive.complete(null)
                    userLastSeen.complete(null)
                }

                override fun onNetworkError(e: java.lang.Exception?) {
                    userIsActive.complete(null)
                    userLastSeen.complete(null)
                }
            })

            matrixInstance.defaultSession.profileApiClient.displayname(userID, object : ApiCallback<String> {
                override fun onSuccess(info: String?) {
                    userName.complete(info)
                }

                override fun onUnexpectedError(e: Exception?) {
                    result.completeExceptionally(e)
                    userName.complete(null)
                }

                override fun onMatrixError(e: MatrixError?) {
                    //promise.reject(RuntimeException(e!!.error))
                    userName.complete("")
                }

                override fun onNetworkError(e: Exception?) {
                    result.completeExceptionally(e)
                    userName.complete(null)
                }
            })

            matrixInstance.defaultSession.profileApiClient.avatarUrl(userID, object : ApiCallback<String> {
                override fun onSuccess(info: String?) {
                    userAvatarUrl.complete(info)
                }

                override fun onUnexpectedError(e: Exception?) {
                    userAvatarUrl.complete(null)
                }

                override fun onMatrixError(e: MatrixError?) {
                    //promise.reject(RuntimeException(e!!.error))
                    userAvatarUrl.complete(null)
                }

                override fun onNetworkError(e: Exception?) {
                    userAvatarUrl.complete(null)
                }
            })

            GlobalScope.launch {
                val name = userName.get()
                val avatarUrl = userAvatarUrl.get()
                val isActive = userIsActive.get()
                val lastSeen = userLastSeen.get()
                result.complete(
                        UserModel(
                                userID,
                                name ?: "",
                                avatarUrl ?: "",
                                lastSeen,
                                isActive,
                                roomId = roomId
                        )
                )
            }
        } else {
            result.completeExceptionally(Exception("Matrix is not available!"))
        }

        return result
    }

    private fun getRoomId(rooms:List<Room>, userID: String): String? {
        for(i in rooms.indices){
            if(rooms[i].getMember(userID) != null){
                return rooms[i].roomId
            }
        }
        return null
    }
}