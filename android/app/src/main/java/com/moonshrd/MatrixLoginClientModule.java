package com.moonshrd;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.moonshrd.utils.RNUtilsKt;
import com.moonshrd.utils.matrix.LoginHandler;
import com.moonshrd.utils.matrix.Matrix;
import com.moonshrd.utils.matrix.RegistrationManager;

import org.matrix.androidsdk.HomeServerConnectionConfig;
import org.matrix.androidsdk.core.JsonUtils;
import org.matrix.androidsdk.core.Log;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.callback.SimpleApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.rest.model.login.LocalizedFlowDataLoginTerms;
import org.matrix.androidsdk.rest.model.login.RegistrationFlowResponse;
import org.matrix.androidsdk.rest.model.sync.SyncResponse;
import org.matrix.androidsdk.ssl.CertUtil;
import org.matrix.androidsdk.ssl.UnrecognizedCertificateException;
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
    public void register(String homeserverUri, String identityUri, String email, String password, Promise promise) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .withIdentityServerUri(Uri.parse(identityUri))
                .build();

        RegistrationManager registrationManager = new RegistrationManager(null);
        registrationManager.setHsConfig(hsConfig);
        registrationManager.setAccountData(email, password); // FIXME we temporary use usernames instead of email identity, should be changed in future
        //registrationManager.addEmailThreePid(new ThreePid(email, ThreePid.MEDIUM_EMAIL));
        getRegFlowsAndRegister(hsConfig, registrationManager, promise);
    }

    @ReactMethod
    public void login(String homeserverUri, String identityUri, String email, String password, Promise promise) {
        HomeServerConnectionConfig hsConfig = new HomeServerConnectionConfig.Builder()
                .withHomeServerUri(Uri.parse(homeserverUri))
                .withIdentityServerUri(Uri.parse(identityUri))
                .withShouldAcceptTlsExtensions(true)
                .build();

        LoginHandler loginHandler = new LoginHandler();
        loginHandler.login(getReactApplicationContext(), hsConfig, email, "", "", password, new ApiCallback<Void>() {
            @Override
            public void onNetworkError(Exception e) {
                UnrecognizedCertificateException uException = CertUtil.getCertificateException(e);
                if(uException != null) {
                    hsConfig.getAllowedFingerprints().add(uException.getFingerprint());
                    login(hsConfig, email, password, promise);
                    return;
                }
                promise.reject("onNetworkError", e.getMessage());
            }

            @Override
            public void onMatrixError(MatrixError e) {
                promise.reject("onMatrixError", e.getMessage());
            }

            @Override
            public void onUnexpectedError(Exception e) {
                promise.reject("onUnexpectedError", e.getMessage());
            }

            @Override
            public void onSuccess(Void info) {
                promise.resolve(true);
                startListeningEventStream();
            }
        });
    }

    private void login(HomeServerConnectionConfig hsConfig, String email, String password, Promise promise) {
        LoginHandler loginHandler = new LoginHandler();
        loginHandler.login(getReactApplicationContext(), hsConfig, email, "", "", password, new ApiCallback<Void>() {
            @Override
            public void onNetworkError(Exception e) {
                promise.reject("onNetworkError", e.getMessage());
            }

            @Override
            public void onMatrixError(MatrixError e) {
                promise.reject("onMatrixError", e.getMessage());
            }

            @Override
            public void onUnexpectedError(Exception e) {
                promise.reject("onUnexpectedError", e.getMessage());
            }

            @Override
            public void onSuccess(Void info) {
                promise.resolve(true);
                startListeningEventStream();
            }
        });
    }

    @ReactMethod
    public void onAppStart(Promise promise) {
        Matrix matrixInstance = Matrix.getInstance(getReactApplicationContext());
        List<HomeServerConnectionConfig> credentialsList = matrixInstance.getLoginStorage().getCredentialsList();
        if(credentialsList.size() != 0) {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("other_prefs", Context.MODE_PRIVATE);
            Globals.State.isInitialSyncComplete = prefs.getBoolean("isInitialSyncComplete", false);
            Matrix.getInstance(getReactApplicationContext()).createSession(credentialsList.get(0));
            startListeningEventStream();
            promise.resolve(true);
        }
        promise.resolve(false);
    }

    @ReactMethod
    public void logout() {
        Matrix matrixInstance = Matrix.getInstance(getReactApplicationContext());
        SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("other_prefs", Context.MODE_PRIVATE);
        prefs.edit().remove("isInitialSyncComplete").apply();
        if(matrixInstance.getDefaultSession() != null) {
            matrixInstance.getDefaultSession().stopEventStream();
        }
        matrixInstance.clearSessions(getReactApplicationContext(), true, null);
        matrixInstance.getLoginStorage().clear();
    }

    private void getRegFlowsAndRegister(HomeServerConnectionConfig hsConfig, RegistrationManager registrationManager, Promise promise) {
        Log.d(LOG_TAG, "## getRegFlowsAndRegister()");

        if (!registrationManager.hasRegistrationResponse()) {
            try {

                new LoginHandler().getSupportedRegistrationFlows(getReactApplicationContext(), hsConfig, new SimpleApiCallback<Void>() {
                    @Override
                    public void onSuccess(Void avoid) {
                        // should never be called
                    }

                    @Override
                    public void onNetworkError(Exception e) {
                        promise.reject("onNetworkError", e.getMessage());
                    }

                    @Override
                    public void onUnexpectedError(Exception e) {
                        promise.reject("onUnexpectedError", e.getMessage());
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
                            attemptRegistration(registrationManager, promise);
                        } else {
                            promise.reject("onMatrixError", e.getMessage());
                        }
                    }
                });
            } catch (Exception e) {
                Log.e(LOG_TAG, "## checkRegistrationFlows(): ERROR " + e.getMessage());
            }
        }
    }

    private void attemptRegistration(RegistrationManager registrationManager, Promise promise) {
        registrationManager.attemptRegistration(getReactApplicationContext(), new RegistrationManager.RegistrationListener() {
            @Override
            public void onRegistrationSuccess(String warningMessage) {
                Log.i(LOG_TAG, "# onRegistrationSuccess(warningMessage=" + warningMessage + ")");
                promise.resolve(warningMessage);
                startListeningEventStream();
            }

            @Override
            public void onRegistrationFailed(String message) {
                Log.e(LOG_TAG, "# onRegistrationFailed(message=" + message + ")");
                promise.reject("onRegistrationFailed", message);
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
                promise.reject("onThreePidRequestFailed", message);
            }

            @Override
            public void onResourceLimitExceeded(MatrixError e) {
                WritableMap args = Arguments.createMap();
                args.putString("message", e.error);
                args.putInt("retryAfter", e.retry_after_ms);
                Log.d(LOG_TAG, "# onResourceLimitExceeded(e=" + e.error + ")");
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("message", e.getMessage());
                jsonObject.addProperty("retryAfter", e.retry_after_ms);
                promise.reject("onResourceLimitExceeded", jsonObject.toString());
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
