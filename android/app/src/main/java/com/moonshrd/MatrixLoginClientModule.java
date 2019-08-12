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
import org.matrix.androidsdk.core.Log;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.data.store.MXFileStore;
import org.matrix.androidsdk.rest.client.LoginRestClient;
import org.matrix.androidsdk.rest.model.WellKnown;
import org.matrix.androidsdk.rest.model.WellKnownBaseConfig;
import org.matrix.androidsdk.rest.model.login.Credentials;
import org.matrix.androidsdk.rest.model.login.LocalizedFlowDataLoginTerms;
import org.matrix.androidsdk.rest.model.login.RegistrationParams;
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
        registrationManager.setAccountData(null, password);
        registrationManager.addEmailThreePid(new ThreePid(email, ThreePid.MEDIUM_EMAIL));
        registrationManager.attemptRegistration(getReactApplicationContext(), new RegistrationManager.RegistrationListener() {
            @Override
            public void onRegistrationSuccess(String warningMessage) {

            }

            @Override
            public void onRegistrationFailed(String message) {

            }

            @Override
            public void onWaitingEmailValidation() {

            }

            @Override
            public void onWaitingCaptcha(String publicKey) {

            }

            @Override
            public void onWaitingTerms(List<LocalizedFlowDataLoginTerms> localizedFlowDataLoginTerms) {

            }

            @Override
            public void onThreePidRequestFailed(String message) {

            }

            @Override
            public void onResourceLimitExceeded(MatrixError e) {

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

            }

            @Override
            public void onMatrixError(MatrixError e) {

            }

            @Override
            public void onUnexpectedError(Exception e) {

            }

            @Override
            public void onSuccess(Void info) {

            }
        });
    }

    private MXSession createSession(HomeServerConnectionConfig hsConfig, Credentials info) {
        MXFileStore store = new MXFileStore(hsConfig, true, getReactApplicationContext());
        return new MXSession.Builder(hsConfig, new MXDataHandler(store, info), getReactApplicationContext())
                .build();
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
