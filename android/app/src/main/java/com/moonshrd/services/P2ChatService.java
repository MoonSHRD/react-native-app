package com.moonshrd.services;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import com.google.gson.Gson;
import com.moonshrd.MainApplication;
import com.moonshrd.models.Message;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static p2mobile.P2mobile.getMessages;
import static p2mobile.P2mobile.publishMessage;
import static p2mobile.P2mobile.start;

public class P2ChatService extends Service {
    private final static String LOG_TAG = "P2ChatService";

    private P2ChatServiceBinder binder = new P2ChatServiceBinder();
    private ScheduledExecutorService scheduledExecutorService;

    public P2ChatService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        onServiceStart();
        return Service.START_NOT_STICKY;
    }

    private void onServiceStart() {
        final Gson gson = new Gson();
        scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
        new Thread(() -> start(MainApplication.SERVICE_TOPIC, MainApplication.PROTOCOL_ID, "", 0)).start();
        scheduledExecutorService.scheduleAtFixedRate(() -> {
            String message = getMessages();
            if (!message.isEmpty()) {
                Message messageObject = gson.fromJson(message, Message.class);
                Log.d(LOG_TAG, "New message! " + messageObject.from + " > " + messageObject.body);
            }
        }, 0, 300, TimeUnit.MILLISECONDS);
    }

    public class P2ChatServiceBinder extends Binder {
        public P2ChatService getService() {
            return P2ChatService.this;
        }
    }

    public void sendMessage(String text) {
        publishMessage(MainApplication.SERVICE_TOPIC, text + "\n");
    }
}
