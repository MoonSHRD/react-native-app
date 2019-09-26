package com.moonshrd.repository

import com.moonshrd.models.UserModel

object ContactRepository {
    private var contacts = ArrayList<UserModel>()

    fun getAllContacts(): ArrayList< UserModel> {
        return contacts
    }

    fun addContact(localChat: UserModel) {
        contacts.add(localChat)
    }

    fun removeContact(topic: UserModel) {
        contacts.remove(topic)
    }

    fun addTopicUser(topic: String,userId:String){
            for(i in contacts.indices){
                if(userId==contacts[i].userId){
                    contacts[i].topics.add(topic)
                }
            }
    }
}