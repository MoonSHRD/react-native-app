package com.moonshrd;

import android.content.Context;
import android.text.TextUtils;

import org.matrix.androidsdk.HomeServerConnectionConfig;
import org.matrix.androidsdk.MXSession;
import org.matrix.androidsdk.core.callback.ApiCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.rest.client.LoginRestClient;
import org.matrix.androidsdk.rest.client.ThirdPidRestClient;
import org.matrix.androidsdk.rest.model.login.Credentials;
import org.matrix.androidsdk.rest.model.login.LoginFlow;
import org.matrix.androidsdk.rest.model.login.RegistrationParams;
import org.matrix.androidsdk.rest.model.pid.ThreePid;

import java.util.Collection;
import java.util.List;
import java.util.Locale;

public class LoginHandler {
    /**
     * The account login succeeds so create the dedicated session and store it.
     *
     * @param appCtx      the application context.
     * @param hsConfig    the homeserver config
     * @param credentials the credentials
     * @param callback    the callback
     */
    private void onLoginDone(Context appCtx,
                             HomeServerConnectionConfig hsConfig,
                             Credentials credentials,
                             ApiCallback<Void> callback) {
        // sanity check - GA issue
        if (TextUtils.isEmpty(credentials.userId)) {
            callback.onMatrixError(new MatrixError(MatrixError.FORBIDDEN, "No user id"));
            return;
        }

        Collection<MXSession> sessions = Matrix.getMXSessions(appCtx);
        boolean isDuplicated = false;

        for (MXSession existingSession : sessions) {
            Credentials cred = existingSession.getCredentials();
            isDuplicated |= TextUtils.equals(credentials.userId, cred.userId) && TextUtils.equals(credentials.homeServer, cred.homeServer);
        }

        if (!isDuplicated) {
            hsConfig.setCredentials(credentials);
            MXSession session = Matrix.getInstance(appCtx).createSession(hsConfig);
            Matrix.getInstance(appCtx).addSession(session);
        }

        callback.onSuccess(null);
    }

    /**
     * Try to login.
     * The MXSession is created if the operation succeeds.
     *
     * @param ctx                the context.
     * @param hsConfig           The homeserver config.
     * @param username           The username.
     * @param phoneNumber        The phone number.
     * @param phoneNumberCountry The phone number country code.
     * @param password           The password;
     * @param callback           The callback.
     */
    public void login(Context ctx,
                      final HomeServerConnectionConfig hsConfig,
                      final String username,
                      final String phoneNumber,
                      final String phoneNumberCountry,
                      final String password,
                      final ApiCallback<Void> callback) {
        final Context appCtx = ctx.getApplicationContext();

        callLogin(ctx, hsConfig, username, phoneNumber, phoneNumberCountry, password, new ApiCallback<Credentials>() {
            @Override
            public void onSuccess(Credentials credentials) {
                onLoginDone(appCtx, hsConfig, credentials, callback);
            }

            @Override
            public void onNetworkError(Exception e) {
                callback.onNetworkError(e);
            }

            @Override
            public void onMatrixError(MatrixError e) {
                callback.onMatrixError(e);
            }

            @Override
            public void onUnexpectedError(Exception e) {
                callback.onUnexpectedError(e);
            }
        });
    }

    /**
     * Log the user using the given params after identifying if the login is a 3pid, a username or a phone number
     *
     * @param hsConfig
     * @param username
     * @param phoneNumber
     * @param phoneNumberCountry
     * @param password
     * @param callback
     */
    private void callLogin(final Context ctx,
                           final HomeServerConnectionConfig hsConfig,
                           final String username,
                           final String phoneNumber,
                           final String phoneNumberCountry,
                           final String password,
                           final ApiCallback<Credentials> callback) {
        LoginRestClient client = new LoginRestClient(hsConfig);
        String deviceName = ctx.getString(R.string.login_mobile_device);

        if (!TextUtils.isEmpty(username)) {
            if (android.util.Patterns.EMAIL_ADDRESS.matcher(username).matches()) {
                // Login with 3pid
                client.loginWith3Pid(ThreePid.MEDIUM_EMAIL,
                        username.toLowerCase(Locale.ENGLISH), password, deviceName, null, callback);
            } else {
                // Login with user
                client.loginWithUser(username, password, deviceName, null, callback);
            }
        } else if (!TextUtils.isEmpty(phoneNumber) && !TextUtils.isEmpty(phoneNumberCountry)) {
            client.loginWithPhoneNumber(phoneNumber, phoneNumberCountry, password, deviceName, null, callback);
        }
    }

    /**
     * Retrieve the supported login flows of a home server.
     *
     * @param ctx      the application context.
     * @param hsConfig the home server config.
     * @param callback the supported flows list callback.
     */
    public void getSupportedLoginFlows(Context ctx, final HomeServerConnectionConfig hsConfig, final ApiCallback<List<LoginFlow>> callback) {
        final Context appCtx = ctx.getApplicationContext();
        LoginRestClient client = new LoginRestClient(hsConfig);

        client.getSupportedLoginFlows(new ApiCallback<List<LoginFlow>>() {
            @Override
            public void onSuccess(List<LoginFlow> info) {
                callback.onSuccess(info);
            }

            @Override
            public void onNetworkError(Exception e) {
                getSupportedLoginFlows(appCtx, hsConfig, callback);
            }

            @Override
            public void onMatrixError(MatrixError e) {
                callback.onMatrixError(e);
            }

            @Override
            public void onUnexpectedError(Exception e) {
                callback.onUnexpectedError(e);
            }
        });
    }

    /**
     * Retrieve the supported registration flows of a home server.
     *
     * @param ctx      the application context.
     * @param hsConfig the home server config.
     * @param callback the supported flows list callback.
     */
    public void getSupportedRegistrationFlows(Context ctx,
                                              final HomeServerConnectionConfig hsConfig,
                                              final ApiCallback<Void> callback) {
        final RegistrationParams params = new RegistrationParams();

        final Context appCtx = ctx.getApplicationContext();

        LoginRestClient client = new LoginRestClient(hsConfig);

        // avoid dispatching the device name
        params.initial_device_display_name = ctx.getString(R.string.login_mobile_device);

        client.register(params, new ApiCallback<Credentials>() {
            @Override
            public void onSuccess(Credentials credentials) {
                // Should never happen, onMatrixError() will be called
                onLoginDone(appCtx, hsConfig, credentials, callback);
            }

            @Override
            public void onNetworkError(Exception e) {
                getSupportedRegistrationFlows(appCtx, hsConfig, callback);
            }

            @Override
            public void onMatrixError(MatrixError e) {
                callback.onMatrixError(e);
            }

            @Override
            public void onUnexpectedError(Exception e) {
                callback.onUnexpectedError(e);
            }
        });
    }

    /**
     * Perform the validation of a mail ownership.
     *
     * @param aCtx              Android App context
     * @param aHomeServerConfig server configuration
     * @param aToken            the token
     * @param aClientSecret     the client secret
     * @param aSid              the server identity session id
     * @param aRespCallback     asynchronous callback response
     */
    public void submitEmailTokenValidation(final Context aCtx,
                                           final HomeServerConnectionConfig aHomeServerConfig,
                                           final String aToken,
                                           final String aClientSecret,
                                           final String aSid,
                                           final ApiCallback<Boolean> aRespCallback) {
        final ThreePid pid = new ThreePid(null, ThreePid.MEDIUM_EMAIL);
        ThirdPidRestClient restClient = new ThirdPidRestClient(aHomeServerConfig);

        pid.submitValidationToken(restClient, aToken, aClientSecret, aSid, new ApiCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean info) {
                aRespCallback.onSuccess(info);
            }

            @Override
            public void onNetworkError(Exception e) {
                submitEmailTokenValidation(aCtx, aHomeServerConfig, aToken, aClientSecret, aSid, aRespCallback);
            }

            @Override
            public void onMatrixError(MatrixError e) {
                aRespCallback.onMatrixError(e);
            }

            @Override
            public void onUnexpectedError(Exception e) {
                aRespCallback.onUnexpectedError(e);
            }
        });
    }
}
