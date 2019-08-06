package com.moonshrd;

import org.matrix.androidsdk.MXSession;
import org.matrix.androidsdk.rest.model.login.Credentials;

import io.realm.Realm;

public class Globals {
    public static Realm credsRealm = null;

    public static Credentials currMatrixCreds = null;
    public static MXSession currMatrixSession = null;
}
