package com.moonshrd;

import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.moonshrd.model.matrix.AuthParamsLPWith3PID;
import com.moonshrd.model.realm.CredentialsModel;

import org.matrix.androidsdk.HomeServerConnectionConfig;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.rest.client.LoginRestClient;
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
    public void register(String homeserverUri, String email, String password, Callback onNetworkError, Callback onMatrixError,
                         Callback onUnexpectedError, Callback onSuccess) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
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
                onNetworkError.invoke(e.getMessage());
            }

            @Override
            public void onMatrixError(MatrixError e) {
                onMatrixError.invoke(e.getMessage());
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
            }
        });
    }

    @ReactMethod
    public void login(String homeserverUri, String email, String password, Callback onNetworkError, Callback onMatrixError,
                      Callback onUnexpectedError, Callback onSuccess) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .build();

        new LoginRestClient(hsConfig).loginWith3Pid("email", email, password, new ApiCallback<Credentials>() {
            @Override
            public void onNetworkError(Exception e) {
                onNetworkError.invoke(e.getMessage());
            }

            @Override
            public void onMatrixError(MatrixError e) {
                onMatrixError.invoke(e.getMessage());
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
            }
        });
    }

    private void saveCredentials(Credentials creds) {
        Globals.currentRealm.executeTransactionAsync(realm -> {
            realm.delete(CredentialsModel.class); // probably we may use multi-account feature, so FIXME
            realm.copyToRealm(new CredentialsModel(creds.userId, creds.wellKnown.homeServer.baseURL,
                    creds.accessToken, creds.refreshToken, creds.deviceId));
        });
    }
}
