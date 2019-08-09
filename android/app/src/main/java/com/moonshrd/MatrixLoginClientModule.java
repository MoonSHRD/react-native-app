package com.moonshrd;

import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.moonshrd.model.matrix.AuthParamsLPWith3PID;
import com.moonshrd.model.realm.CredentialsModel;

import org.matrix.androidsdk.HomeServerConnectionConfig;
import org.matrix.androidsdk.MXDataHandler;
import org.matrix.androidsdk.MXSession;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.data.store.MXFileStore;
import org.matrix.androidsdk.rest.client.LoginRestClient;
import org.matrix.androidsdk.rest.model.WellKnown;
import org.matrix.androidsdk.rest.model.WellKnownBaseConfig;
import org.matrix.androidsdk.rest.model.login.Credentials;
import org.matrix.androidsdk.rest.model.login.RegistrationParams;

import javax.annotation.Nonnull;

public class MatrixLoginClientModule extends ReactContextBaseJavaModule {
    public MatrixLoginClientModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "MatrixLoginClient";
    }

    @ReactMethod
    public void register(String homeserverUri, String identityUri, String email, String password,
                         Callback onUnexpectedError, Callback onSuccess) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .withIdentityServerUri(Uri.parse(identityUri))
                .build();

        RegistrationParams params = new RegistrationParams();

        AuthParamsLPWith3PID authParams = new AuthParamsLPWith3PID();
        authParams.identifier.medium = "email";
        authParams.identifier.address = email;

        params.auth = authParams;
        params.bind_email = true;
        params.password = password;

        new LoginRestClient(hsConfig).register(params, new ApiCallback<Credentials>() {
            @Override
            public void onNetworkError(Exception e) {
            }

            @Override
            public void onMatrixError(MatrixError e) {
            }

            @Override
            public void onUnexpectedError(Exception e) {
                onUnexpectedError.invoke(e.getMessage());
            }

            @Override
            public void onSuccess(Credentials info) {
                onSuccess.invoke();
                saveCredentials(info);
                Globals.currMatrixCreds = info;
                Globals.currMatrixSession = createSession(hsConfig, info);
            }
        });
    }

    @ReactMethod
    public void login(String homeserverUri, String identityUri, String email, String password,
                      Callback onUnexpectedError, Callback onSuccess) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .withIdentityServerUri(Uri.parse(identityUri))
                .build();

        new LoginRestClient(hsConfig).loginWith3Pid("email", email, password, new ApiCallback<Credentials>() {
            @Override
            public void onNetworkError(Exception e) {
            }

            @Override
            public void onMatrixError(MatrixError e) {
            }

            @Override
            public void onUnexpectedError(Exception e) {
                onUnexpectedError.invoke(e.getMessage());
            }

            @Override
            public void onSuccess(Credentials info) {
                onSuccess.invoke();
                saveCredentials(info);
                Globals.currMatrixCreds = info;
                Globals.currMatrixSession = createSession(hsConfig, info);
            }
        });
    }

    private void saveCredentials(Credentials creds) {
        MainApplication.getCredsRealmInstance().executeTransaction(realm -> {
            realm.delete(CredentialsModel.class); // probably we may use multi-account feature, so FIXME
            realm.copyToRealm(new CredentialsModel(creds.userId, creds.wellKnown.homeServer.baseURL,
                    creds.accessToken, creds.refreshToken, creds.deviceId, creds.wellKnown.identityServer.baseURL));
        });
    }

    private MXSession createSession(HomeServerConnectionConfig hsConfig, Credentials info) {
        MXFileStore store = new MXFileStore(hsConfig, true, getReactApplicationContext());
        return new MXSession.Builder(hsConfig, new MXDataHandler(store, info), getReactApplicationContext())
                .build();
    }

    @ReactMethod
    public boolean onAppStart() {
        CredentialsModel credsModel = MainApplication.getCredsRealmInstance().where(CredentialsModel.class).findFirst();
        if(credsModel != null) {
            Credentials creds = createCredentialsFromRealmModel(credsModel);
            HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                    .withHomeServerUri(Uri.parse(creds.wellKnown.homeServer.baseURL))
                    .withIdentityServerUri(Uri.parse(creds.wellKnown.identityServer.baseURL))
                    .build();

            Globals.currMatrixCreds = creds;
            Globals.currMatrixSession = createSession(hsConfig, creds);
            return true;
        }
        return false;
    }

    @ReactMethod
    public void logout(Callback onUnexpectedError, Callback onSuccess) {
        MainApplication.getCredsRealmInstance().executeTransactionAsync(realm -> {
            realm.delete(CredentialsModel.class);
        });
        Globals.currMatrixSession.clear(getReactApplicationContext(), new ApiCallback<Void>() {
            @Override
            public void onNetworkError(Exception e) {
            }

            @Override
            public void onMatrixError(MatrixError e) {
            }

            @Override
            public void onUnexpectedError(Exception e) {
                onUnexpectedError.invoke(e.getMessage());
            }

            @Override
            public void onSuccess(Void info) {
                onSuccess.invoke();
            }
        });
        Globals.currMatrixCreds = null;
    }

    private Credentials createCredentialsFromRealmModel(CredentialsModel model) {
        Credentials creds = new Credentials();
        creds.accessToken = model.getAccessToken();
        creds.deviceId = model.getDeviceId();
        creds.refreshToken = model.getRefreshToken();
        creds.userId = model.getUserId();

        WellKnown wk = new WellKnown();
        wk.homeServer = new WellKnownBaseConfig();
        wk.homeServer.baseURL = model.getHomeServer();

        wk.identityServer = new WellKnownBaseConfig();
        wk.identityServer.baseURL = model.getIdentityServer();

        creds.wellKnown = wk;

        return creds;
    }
}
