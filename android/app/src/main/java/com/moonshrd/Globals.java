package com.moonshrd;

import org.matrix.androidsdk.rest.model.login.Credentials;

import io.realm.Realm;

public class Globals {
    public static Realm currentRealm = null;

    public static Credentials currMatrixCreds = null;
}
