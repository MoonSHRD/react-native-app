package com.moonshrd.models

data class UserModel (
        val userId: String,
        val name: String?,
        val avatarUrl: String?,

        // Optional part of a model goes here
        val lastSeen: Long? = 0, // UNIX timestamp
        val isActive:Boolean? = false,
        val lastMessage: String = "",
        val lastMessageDate: Long = 0,
        val lastMessageState: String = "", // Just Event.SentState in String representation
        val unreadMessagesCount: Int = 0,
        val avatarLink: String? = null,
        val roomId: String? = null,
        val multiAddress: String? = null // libp2p multiaddress for local chats
)