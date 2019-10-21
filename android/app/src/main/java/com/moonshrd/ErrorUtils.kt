package com.moonshrd

import com.google.gson.Gson
import com.moonshrd.di.modules.WebModule
import retrofit2.Response
import java.io.IOException
import javax.inject.Inject

class ErrorUtils {

    @Inject
    lateinit var gson: Gson

    fun parseError(response: Response<*>): APIError {

        val error: APIError

        try {
            error = gson.fromJson(response.body().toString(),APIError::class.java)
        } catch (e: IOException) {
            return APIError()
        }
        return error
    }
}