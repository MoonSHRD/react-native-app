package com.moonshrd.di.modules

import android.content.Context
import com.google.gson.Gson
import com.moonshrd.utils.TopicStorage
import com.moonshrd.utils.matrix.Matrix
import dagger.Module
import dagger.Provides
import javax.inject.Singleton


@Module
class ApplicationModule(var context: Context) {

    @Provides
    @Singleton
    fun providesContext(): Context {
        return context
    }

    @Provides
    @Singleton
    fun provideGson(): Gson {
        return Gson()
    }

    @Provides
    @Singleton
    fun provideMatrix(context: Context): Matrix {
        return Matrix.getInstance(context)
    }

    @Provides
    @Singleton
    fun provideTopicStorage(context: Context): TopicStorage {
        return TopicStorage(context)
    }
}