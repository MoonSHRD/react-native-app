package com.moonshrd;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.moonshrd.util.RNUtilsKt;

import org.matrix.androidsdk.HomeServerConnectionConfig;
import org.matrix.androidsdk.core.JsonUtils;
import org.matrix.androidsdk.core.Log;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.callback.SimpleApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.rest.model.login.LocalizedFlowDataLoginTerms;
import org.matrix.androidsdk.rest.model.login.RegistrationFlowResponse;
import org.matrix.androidsdk.rest.model.sync.SyncResponse;
import org.matrix.androidsdk.sync.DefaultEventsThreadListener;
import org.matrix.androidsdk.sync.EventsThreadListener;

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
        registrationManager.setAccountData(email, password); // FIXME we temporary use usernames instead of email identity, should be changed in future
        //registrationManager.addEmailThreePid(new ThreePid(email, ThreePid.MEDIUM_EMAIL));
        getRegFlowsAndRegister(hsConfig, registrationManager);
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
        Matrix matrixInstance = Matrix.getInstance(getReactApplicationContext());
        List<HomeServerConnectionConfig> credentialsList = matrixInstance.getLoginStorage().getCredentialsList();
        if(credentialsList.size() != 0) {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("other_prefs", Context.MODE_PRIVATE);
            Globals.State.isInitialSyncComplete = prefs.getBoolean("isInitialSyncComplete", false);
            Matrix.getInstance(getReactApplicationContext()).createSession(credentialsList.get(0));
            startListeningEventStream();
            return true;
        }
        return false;
    }

    @ReactMethod
    public void logout() {
        Matrix.getInstance(getReactApplicationContext()).clearSessions(getReactApplicationContext(), true, null);
    }

    private void getRegFlowsAndRegister(HomeServerConnectionConfig hsConfig, RegistrationManager registrationManager) {
        Log.d(LOG_TAG, "## checkRegistrationFlows()");

        if (!registrationManager.hasRegistrationResponse()) {
            try {

                new LoginHandler().getSupportedRegistrationFlows(getReactApplicationContext(), hsConfig, new SimpleApiCallback<Void>() {
                    @Override
                    public void onSuccess(Void avoid) {
                        // should never be called
                    }

                    @Override
                    public void onNetworkError(Exception e) {
                        RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onNetworkError", "exceptionText", e.getMessage());
                    }

                    @Override
                    public void onUnexpectedError(Exception e) {
                        RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onUnexpectedError", "exceptionText", e.getMessage());
                    }

                    @Override
                    public void onMatrixError(MatrixError e) {
                        Log.d(LOG_TAG, "## checkRegistrationFlows(): onMatrixError - Resp=" + e.getLocalizedMessage());
                        RegistrationFlowResponse registrationFlowResponse = null;

                        // when a response is not completed the server returns an error message
                        if (null != e.mStatus) {
                            if (e.mStatus == 401) {
                                try {
                                    registrationFlowResponse = JsonUtils.toRegistrationFlowResponse(e.mErrorBodyAsString);
                                } catch (Exception castExcept) {
                                    Log.e(LOG_TAG, "JsonUtils.toRegistrationFlowResponse " + castExcept.getLocalizedMessage(), castExcept);
                                }
                            }
                        }

                        if (null != registrationFlowResponse) {
                            registrationManager.setSupportedRegistrationFlows(registrationFlowResponse);
                            attemptRegistration(registrationManager);
                        } else {
                            RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onMatrixError", "exceptionText", e.getMessage());
                        }
                    }
                });
            } catch (Exception e) {
                Log.e(LOG_TAG, "## checkRegistrationFlows(): ERROR " + e.getMessage());
            }
        }
    }

    private void attemptRegistration(RegistrationManager registrationManager) {
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
                //RNUtilsKt.sendEvent(getReactApplicationContext(), "onWaitingEmailValidation", null);
                //attemptRegistration(registrationManager);
            }

            @Override
            public void onWaitingCaptcha(String publicKey) {
                //RNUtilsKt.sendEventWithOneStringArg(getReactApplicationContext(), "onWaitingCaptcha", "publicKey", publicKey);
                //attemptRegistration(registrationManager);
            }

            @Override
            public void onWaitingTerms(List<LocalizedFlowDataLoginTerms> localizedFlowDataLoginTerms) {
                Log.d(LOG_TAG, "# onWaitingTerms");
                //attemptRegistration(registrationManager);
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

    private void startListeningEventStream() {
        Matrix matrixInstance = Matrix.getInstance(getReactApplicationContext());
        matrixInstance.getDefaultSession().startEventStream(new EventsThreadListener() {
            private DefaultEventsThreadListener defaultListener = new DefaultEventsThreadListener(matrixInstance.getDefaultSession().getDataHandler());

            @Override
            public void onSyncResponse(SyncResponse response, String fromToken, boolean isCatchingUp) {
                defaultListener.onSyncResponse(response, fromToken, isCatchingUp);
                SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("other_prefs", Context.MODE_PRIVATE);
                boolean isInitialSyncComplete = prefs.getBoolean("isInitialSyncComplete", false);
                if(!isInitialSyncComplete) {
                    prefs.edit().putBoolean("isInitialSyncComplete", true).apply();
                    Globals.State.isInitialSyncComplete = true;
                }
            }

            @Override
            public void onSyncError(MatrixError matrixError) {
                defaultListener.onSyncError(matrixError);
            }

            @Override
            public void onConfigurationError(String matrixErrorCode) {
                defaultListener.onConfigurationError(matrixErrorCode);
            }
        }, matrixInstance.getDefaultSession().getNetworkConnectivityReceiver(),null);
    }
}
