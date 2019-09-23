package com.moonshrd.repository

import com.moonshrd.models.MatchModel

object MatchesRepository {
    private val matches = arrayListOf<MatchModel>()

    fun getAllLocalChats(): ArrayList<MatchModel> {
        return matches
    }

    fun addLocalChat(match: MatchModel) {
        matches.add(match)
    }

    fun removeLocalChat(match: MatchModel) {
        matches.remove(match)
    }

    //fun getLocalChat(match: MatchModel): MatchModel? {
   //     return matches.get(match)
   // }
}