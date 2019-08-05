package com.moonshrd.model.realm;

import io.realm.RealmObject;

public class CredentialsModel extends RealmObject {
    private String userId;
    private String homeServer;
    private String accessToken;
    private String refreshToken;
    private String deviceId;

    public CredentialsModel(String userId, String homeServer, String accessToken, String refreshToken, String deviceId) {
        this.userId = userId;
        this.homeServer = homeServer;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.deviceId = deviceId;
    }

    public String getUserId() {
        return userId;
    }

    public String getHomeServer() {
        return homeServer;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setHomeServer(String homeServer) {
        this.homeServer = homeServer;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}
