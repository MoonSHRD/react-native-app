package com.moonshrd.repository

import com.moonshrd.models.UserModel

object MatchContactsRepository {
    private var contacts = ArrayList<UserModel>()

    fun getAllContacts(): ArrayList< UserModel> {
        return contacts
    }

    fun addContact(localChat: UserModel) {
        contacts.add(localChat)
    }

    fun removeAllContacts() {
        contacts.clear()
    }

    fun removeContact(topic: UserModel) {
        contacts.remove(topic)
    }

    fun getUser(userId:String):UserModel?{
        for(i in contacts.indices){
            if(userId == contacts[i].userId){
                return contacts[i]
            }
        }
        return null
    }

    fun addTopicUser(topic: String,user:UserModel){
        var isFind = false
            for(i in contacts.indices){
                if(user.userId==contacts[i].userId){
                    contacts[i].topics.add(topic)
                    isFind = true
                }
            }
            if(!isFind){
                user.topics.add(topic)
                contacts.add(user)
            }
    }
}