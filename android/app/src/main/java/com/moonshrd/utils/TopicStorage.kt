package com.moonshrd.utils

import android.content.Context
import org.json.JSONArray

class TopicStorage(private val context: Context) {
    private val PREFS_NAME_TOPIC = "MoonShard.Topics"
    private val PREFS_KEY_TOPIC_ARR = "topicArray"

    private val preferences = context.getSharedPreferences(PREFS_NAME_TOPIC, Context.MODE_PRIVATE)

    fun getTopicList(): MutableList<String> {
        val topicArrJsonStr = preferences.getString(PREFS_KEY_TOPIC_ARR, "")
        if(topicArrJsonStr!!.isEmpty()) {
            return ArrayList()
        }

        val topicArrJson = JSONArray(topicArrJsonStr)
        val topics = ArrayList<String>(topicArrJson.length())

        for(i in 0..topicArrJson.length()-1) {
            topics.add(topicArrJson.getString(i))
        }

        return topics
    }

    fun addTopic(topic: String) {
        val topics = getTopicList()
        topics.add(topic)
        serializeAndSave(topics)
    }

    fun removeTopic(topic: String) {
        val topics = getTopicList()
        topics.remove(topic)
        serializeAndSave(topics)
    }

    private fun serializeAndSave(topics: List<String>) {
        val topicsArrJson = JSONArray(topics)
        preferences.edit().putString(PREFS_KEY_TOPIC_ARR, topicsArrJson.toString()).apply()
    }

    fun clear() {
        preferences.edit().remove(PREFS_KEY_TOPIC_ARR).apply()
    }
}