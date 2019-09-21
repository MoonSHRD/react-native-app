package com.moonshrd.models;

import com.google.gson.annotations.SerializedName;

public class Message {
    @SerializedName("Id") public String id;
    @SerializedName("Body") public String body;
    @SerializedName("From") public String from;
    @SerializedName("Topic") public String topic;
    @SerializedName("Timestamp") public long timestamp;

    public Message() { }

    public Message(String id, String body, String from, String topic, long timestamp) {
        this.id = id;
        this.body = body;
        this.from = from;
        this.topic = topic;
        this.timestamp = timestamp;
    }
}
