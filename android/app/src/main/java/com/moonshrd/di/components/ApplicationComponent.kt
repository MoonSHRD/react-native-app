package com.moonshrd.di.components

import com.moonshrd.MatrixClientModule
import com.moonshrd.MatrixLoginClientModule
import com.moonshrd.P2ChatModule
import com.moonshrd.di.modules.ApplicationModule
import com.moonshrd.services.P2ChatService
import com.moonshrd.utils.matrix.MatrixSdkHelper
import dagger.Component
import javax.inject.Singleton

@Component(modules = [ApplicationModule::class])
@Singleton
interface ApplicationComponent {
    fun inject(matrixClientModule: MatrixClientModule)
    fun inject(matrixLoginClientModule: MatrixLoginClientModule)
    fun inject(p2chatService: P2ChatService)
    fun inject(p2ChatModule: P2ChatModule)
    fun inject(matrixSdkHelper: MatrixSdkHelper)
}