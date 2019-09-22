package com.moonshrd.models

data class LocalChatModel(
        val name: String,
        val lastMessageText: String,
        val lastMessageId: String,
        val lastMessageDate: Long
)