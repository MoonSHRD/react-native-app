package com.moonshrd.repository

import com.moonshrd.models.UserModel

object ContactsMatrixRepository {
    private var contacts = ArrayList<UserModel>()

    fun getAllContacts(): ArrayList<UserModel> {
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

    fun getUser(userId:String): UserModel?{
        for(i in contacts.indices){
            if(userId == contacts[i].userId){
                return contacts[i]
            }
        }
        return null
    }

    fun addTopicUser(user: UserModel){
            contacts.add(user)
    }
}