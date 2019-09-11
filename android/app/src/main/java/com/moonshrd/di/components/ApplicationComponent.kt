package com.moonshrd.di.components

import com.moonshrd.MatrixClientModule
import com.moonshrd.MatrixLoginClientModule
import com.moonshrd.di.modules.ApplicationModule
import dagger.Component
import javax.inject.Singleton

@Component(modules = [ApplicationModule::class])
@Singleton
interface ApplicationComponent {
    fun injectsMatrixClientModule(matrixClientModule: MatrixClientModule)
    fun injectsMatrixLoginModule(matrixLoginClientModule: MatrixLoginClientModule)
}