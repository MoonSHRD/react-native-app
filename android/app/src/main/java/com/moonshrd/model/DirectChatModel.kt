package com.moonshrd.model

data class DirectChatModel (
    val name: String,
    val avatarUri: String,
    val lastSeen: Long = 0, // UNIX timestamp
    val isActive: Boolean = false,
    val lastMessage: String
)
