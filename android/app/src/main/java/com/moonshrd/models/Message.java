package com.moonshrd.models;

import com.google.gson.annotations.SerializedName;

public class Message {
    @SerializedName("Body") public String body;
    @SerializedName("From") public String from;

    public Message() { }

    public Message(String body, String from) {
        this.body = body;
        this.from = from;
    }
}
