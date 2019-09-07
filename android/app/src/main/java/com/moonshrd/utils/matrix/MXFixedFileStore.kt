package com.moonshrd.utils.matrix

import android.content.Context
import android.os.HandlerThread
import org.matrix.androidsdk.HomeServerConnectionConfig
import org.matrix.androidsdk.core.MXOsHandler
import org.matrix.androidsdk.data.store.MXFileStore
import java.lang.reflect.Modifier


/**
 * Class for fixing issues with MXFileStore
 */
class MXFixedFileStore(hsConfig: HomeServerConnectionConfig,
                       enableFileEncryption: Boolean,
                       context: Context) : MXFileStore(hsConfig, enableFileEncryption, context) {
    private val handlerThread: HandlerThread

    init {
        handlerThread = HandlerThread("MXFileStoreBackgroundThread_" + hsConfig.credentials.userId, Thread.MIN_PRIORITY)
        handlerThread.start()

        val field = MXFileStore::class.java.getDeclaredField("mFileStoreHandler")
        if (Modifier.isPrivate(field.getModifiers())) {
            field.setAccessible(true)
            field.set(this, MXOsHandler(handlerThread.looper))
        }
    }
}