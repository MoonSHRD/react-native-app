package com.moonshrd.model

class DirectChatModel {
    lateinit var name: String
    lateinit var avatarUri: String
    var lastSeen: Long = 0 // UNIX timestamp
    var isActive: Boolean = false
    lateinit var lastMessage: String
}
