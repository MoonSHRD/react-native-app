package com.moonshrd.matrixUtils;

import android.app.Activity;
import android.widget.Toast;

import com.moonshrd.R;

import org.matrix.androidsdk.MXSession;
import org.matrix.androidsdk.core.Log;
import org.matrix.androidsdk.core.callback.ApiFailureCallback;
import org.matrix.androidsdk.core.model.MatrixError;
import org.matrix.androidsdk.ssl.Fingerprint;
import org.matrix.androidsdk.ssl.UnrecognizedCertificateException;

/**
 * Listen to error threw by the Matrix client when querying the API
 */
public class ErrorListener implements ApiFailureCallback {
    private static final String LOG_TAG = ErrorListener.class.getSimpleName();

    private final Activity mActivity;
    private final MXSession mSession;

    public ErrorListener(MXSession session, Activity activity) {
        mSession = session;
        mActivity = activity;
    }

    @Override
    public void onNetworkError(final Exception e) {
        Log.e(LOG_TAG, "Network error: " + e.getMessage(), e);

        // Do not trigger toaster if the application is in background
        /*if (!VectorApp.isAppInBackground()) {
            UnrecognizedCertificateException unrecCertEx = CertUtil.getCertificateException(e);
            if (unrecCertEx == null) {
                handleNetworkError(e);
            } else {
                handleCertError(unrecCertEx, e);
            }

        }*/
    }

    @Override
    public void onMatrixError(MatrixError e) {
        Log.e(LOG_TAG, "Matrix error: " + e.errcode + " - " + e.error);

        // The access token was not recognized: log out
        if (MatrixError.UNKNOWN_TOKEN.equals(e.errcode)) {
            // TODO
        }
    }

    @Override
    public void onUnexpectedError(Exception e) {
        Log.e(LOG_TAG, "Unexpected error: " + e.getMessage(), e);
    }

    private void handleNetworkError(Exception e) {
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(mActivity, mActivity.getString(R.string.network_error), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void handleCertError(UnrecognizedCertificateException unrecCertEx, final Exception e) {
        final Fingerprint fingerprint = unrecCertEx.getFingerprint();
        Log.d(LOG_TAG, "Found fingerprint: SHA-256: " + fingerprint.getBytesAsHexString());

        /*mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                UnrecognizedCertHandler.show(mSession.getHomeServerConfig(), fingerprint, true, new UnrecognizedCertHandler.Callback() {
                    @Override
                    public void onAccept() {
                        LoginStorage loginStorage = Matrix.getInstance(mActivity.getApplicationContext()).getLoginStorage();
                        loginStorage.replaceCredentials(mSession.getHomeServerConfig());
                    }

                    @Override
                    public void onIgnore() {
                        handleNetworkError(e);
                    }

                    @Override
                    public void onReject() {
                        CommonActivityUtils.logout(mActivity, Arrays.asList(mSession), true, null);
                    }
                });
            }
        });*/
    }
}