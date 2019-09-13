package com.moonshrd.di.components

import com.moonshrd.MatrixClientModule
import com.moonshrd.MatrixLoginClientModule
import com.moonshrd.P2ChatModule
import com.moonshrd.di.modules.ApplicationModule
import com.moonshrd.services.P2ChatService
import dagger.Component
import javax.inject.Singleton

@Component(modules = [ApplicationModule::class])
@Singleton
interface ApplicationComponent {
    fun injectsMatrixClientModule(matrixClientModule: MatrixClientModule)
    fun injectsMatrixLoginModule(matrixLoginClientModule: MatrixLoginClientModule)
    fun injectsP2ChatService(p2chatService: P2ChatService)
    fun injectsP2ChatModule(p2ChatModule: P2ChatModule)
}