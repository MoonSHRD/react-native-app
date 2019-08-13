package com.moonshrd;

import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.moonshrd.util.RNUtilsKt;

import org.matrix.androidsdk.HomeServerConnectionConfig;
import org.matrix.androidsdk.MXDataHandler;
import org.matrix.androidsdk.MXSession;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.data.store.MXFileStore;
import org.matrix.androidsdk.rest.model.login.Credentials;
import org.matrix.androidsdk.rest.model.login.LocalizedFlowDataLoginTerms;
import org.matrix.androidsdk.rest.model.pid.ThreePid;

import java.util.List;

import javax.annotation.Nonnull;

public class MatrixLoginClientModule extends ReactContextBaseJavaModule {
    private static String LOG_TAG = MatrixLoginClientModule.class.getSimpleName();

    public MatrixLoginClientModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "MatrixLoginClient";
    }

    @ReactMethod
    public void register(String homeserverUri, String identityUri, String email, String password) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .withIdentityServerUri(Uri.parse(identityUri))
                .build();

        RegistrationManager registrationManager = new RegistrationManager(null);
        registrationManager.setHsConfig(hsConfig);
        registrationManager.setAccountData(null, password);
        registrationManager.addEmailThreePid(new ThreePid(email, ThreePid.MEDIUM_EMAIL));
        registrationManager.attemptRegistration(getReactApplicationContext(), new RegistrationManager.RegistrationListener() {
            @Override
            public void onRegistrationSuccess(String warningMessage) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onRegistrationSuccess", "warningMessage", warningMessage);
            }

            @Override
            public void onRegistrationFailed(String message) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onRegistrationFailed", "message", message);
            }

            @Override
            public void onWaitingEmailValidation() {
                RNUtilsKt.sendEvent(getReactApplicationContext(), "onWaitingEmailValidation", null);
            }

            @Override
            public void onWaitingCaptcha(String publicKey) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onWaitingCaptcha", "publicKey", publicKey);
            }

            @Override
            public void onWaitingTerms(List<LocalizedFlowDataLoginTerms> localizedFlowDataLoginTerms) {
                //
            }

            @Override
            public void onThreePidRequestFailed(String message) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onThreePidRequestFailed", "message", message);
            }

            @Override
            public void onResourceLimitExceeded(MatrixError e) {
                WritableMap args = Arguments.createMap();
                args.putString("message", e.error);
                args.putInt("retryAfter", e.retry_after_ms);
                RNUtilsKt.sendEvent(getReactApplicationContext(), "onResourceLimitExceeded", args);
            }
        });

    }

    @ReactMethod
    public void login(String homeserverUri, String identityUri, String email, String password) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .withIdentityServerUri(Uri.parse(identityUri))
                .build();

        LoginHandler loginHandler = new LoginHandler();
        loginHandler.login(getReactApplicationContext(), hsConfig, email, "", "", password, new ApiCallback<Void>() {
            @Override
            public void onNetworkError(Exception e) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onNetworkError", "exceptionText", e.getMessage());
            }

            @Override
            public void onMatrixError(MatrixError e) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onMatrixError", "exceptionText", e.getMessage());
            }

            @Override
            public void onUnexpectedError(Exception e) {
                RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onUnexpectedError", "exceptionText", e.getMessage());
            }

            @Override
            public void onSuccess(Void info) {
                RNUtilsKt.sendEvent(getReactApplicationContext(), "onSuccess", null);
            }
        });
    }

    @ReactMethod
    public boolean onAppStart() {
        return Matrix.getInstance(getReactApplicationContext()).getLoginStorage().getCredentialsList().size() != 0;
    }

    @ReactMethod
    public void logout() {
        Matrix.getInstance(getReactApplicationContext()).clearSessions(getReactApplicationContext(), true, null);
    }
}
