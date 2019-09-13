package com.moonshrd.services;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import com.google.gson.Gson;
import com.moonshrd.MainApplication;
import com.moonshrd.models.Message;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.inject.Inject;

import p2mobile.P2mobile;

import static p2mobile.P2mobile.getMessages;
import static p2mobile.P2mobile.start;

public class P2ChatService extends Service {
    private final static String LOG_TAG = "P2ChatService";
    public static boolean isServiceRunning = false;

    @Inject Gson gson;
    private P2ChatServiceBinder binder = new P2ChatServiceBinder();
    private ScheduledExecutorService scheduledExecutorService;

    public P2ChatService() {
    }

    @Override
    public void onCreate() {
        MainApplication.getComponent().injectsP2ChatService(this);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        onServiceStart(intent.getStringExtra("matrixID"));
        return Service.START_NOT_STICKY;
    }

    private void onServiceStart(String matrixID) {
        scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
        new Thread(() -> start(MainApplication.SERVICE_TOPIC, MainApplication.PROTOCOL_ID, "", 0)).start();
        P2mobile.setMatrixID(matrixID);
        scheduledExecutorService.scheduleAtFixedRate(() -> {
            if(isServiceRunning) {
                getMessage(gson);
            }
        }, 0, 300, TimeUnit.MILLISECONDS);
        isServiceRunning = true;
    }


    private void getMessage(Gson gson){
        String message = getMessages();
        if (!message.isEmpty()) {
            Message messageObject = gson.fromJson(message, Message.class);
            Log.d(LOG_TAG, "New message! " + messageObject.from + " > " + messageObject.body); // FIXME
        }
    }

    public class P2ChatServiceBinder extends Binder {
        public P2ChatService getService() {
            return P2ChatService.this;
        }
    }

    public void sendMessage(String text) {
        if(isServiceRunning) {
            P2mobile.publishMessage(MainApplication.SERVICE_TOPIC, text + "\n");
        }
        onServiceIsNotRunning();
    }

    public void subscribeToTopic(String topic) {
        if(isServiceRunning) {
            P2mobile.subscribeToTopic(topic);
        }
        onServiceIsNotRunning();
    }

    public void unsubscribeFromTopic(String topic) {
        if(isServiceRunning) {
            P2mobile.unsubscribeFromTopic(topic);
        }
        onServiceIsNotRunning();
    }

    private void onServiceIsNotRunning() {
        Log.e(LOG_TAG, "P2ChatService is not running!");
    }

    @Override
    public void onDestroy() {
        isServiceRunning = false;
        scheduledExecutorService.shutdownNow();
    }

    public List<String> getMyTopics() {
        if(isServiceRunning) {
            String topicsJson = P2mobile.getTopics();
            String[] topicsArr = gson.fromJson(topicsJson, String[].class);
            return Arrays.asList(topicsArr);
        }
        onServiceIsNotRunning();
        return new ArrayList<>();
    }
}
