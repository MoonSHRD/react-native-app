package com.moonshrd.model

import org.matrix.androidsdk.rest.model.Event

data class DirectChatModel (
    val name: String,
    val avatarUri: String,
    val lastSeen: Long = 0, // UNIX timestamp
    val isActive: Boolean = false,
    val lastMessage: String,
    val lastMessageDate: Long,
    val lastMessageState: String,
    val unreadMessagesCount: Int
)
