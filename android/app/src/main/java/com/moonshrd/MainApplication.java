package com.moonshrd;

import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.BV.LinearGradient.LinearGradientPackage;
import com.actionsheet.ActionSheetPackage;
import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.moonshrd.di.components.ApplicationComponent;
import com.moonshrd.di.components.DaggerApplicationComponent;
import com.moonshrd.di.modules.ApplicationModule;
import com.moonshrd.services.P2ChatService;
import com.oblador.vectoricons.VectorIconsPackage;


import org.matrix.androidsdk.MXSession;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MainApplication extends Application implements ReactApplication {
    private static ApplicationComponent component;
    public static final String SERVICE_TOPIC = "moonshard";
    public static final String PROTOCOL_ID = "/moonshard/1.0.0";
    public static ServiceConnection serviceConnection = null;
    private static P2ChatService service = null;
    private static ReactContext reactContext;


    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.asList(
              new MainReactPackage(),
            new RNGestureHandlerPackage(),
            new PickerPackage(),
                new VectorIconsPackage(),
                new SvgPackage(),
                new ActionSheetPackage(),
                new LinearGradientPackage(),
                new MatrixClientPackage(),
                new P2ChatPackage()
          );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        component = DaggerApplicationComponent.builder()
                .applicationModule(new ApplicationModule(getApplicationContext()))
                .build();

        SoLoader.init(this, /* native exopackage */ false);

        reactContext = mReactNativeHost.getReactInstanceManager().getCurrentReactContext();
    }

    public static void startP2ChatService(Context context, String matrixID) {
        if(!P2ChatService.isServiceRunning) {

            Intent intent = new Intent(context, P2ChatService.class);
            intent.putExtra("matrixID", matrixID);

            context.startService(intent);
            ServiceConnection serviceConnection = new ServiceConnection() {
                @Override
                public void onServiceConnected(ComponentName name, IBinder service) {
                    MainApplication.serviceConnection = this;
                    MainApplication.service = ((P2ChatService.P2ChatServiceBinder) service).getService();
                }

                @Override
                public void onServiceDisconnected(ComponentName name) {
                    MainApplication.serviceConnection = null;
                    MainApplication.service = null;
                }
            };

            context.bindService(new Intent(context, P2ChatService.class), serviceConnection, Context.BIND_AUTO_CREATE);
            P2ChatService.isServiceRunning = true;
        }
    }

    public static void stopP2ChatService(Context context) {
        if(P2ChatService.isServiceRunning) {
            //context.unbindService(serviceConnection);
            context.stopService(new Intent(context, P2ChatService.class));
            P2ChatService.isServiceRunning = false;
        }
    }

    public static ReactContext getReactContext() {
        return reactContext;
    }

    public static ApplicationComponent getComponent() {
        return component;
    }

    //==============================================================================================================
    // Syncing mxSessions
    //==============================================================================================================


    /**
     * syncing sessions
     */
    private static final Set<MXSession> mSyncingSessions = new HashSet<>();

    /**
     * Add a session in the syncing sessions list
     *
     * @param session the session
     */
    public static void addSyncingSession(MXSession session) {
        synchronized (mSyncingSessions) {
            mSyncingSessions.add(session);
        }
    }

    /**
     * Remove a session in the syncing sessions list
     *
     * @param session the session
     */
    public static void removeSyncingSession(MXSession session) {
        if (null != session) {
            synchronized (mSyncingSessions) {
                mSyncingSessions.remove(session);
            }
        }
    }

    /**
     * Clear syncing sessions list
     */
    public static void clearSyncingSessions() {
        synchronized (mSyncingSessions) {
            mSyncingSessions.clear();
        }
    }

    /**
     * Tell if a session is syncing
     *
     * @param session the session
     * @return true if the session is syncing
     */
    public static boolean isSessionSyncing(MXSession session) {
        boolean isSyncing = false;

        if (null != session) {
            synchronized (mSyncingSessions) {
                isSyncing = mSyncingSessions.contains(session);
            }
        }

        return isSyncing;
    }

    public static P2ChatService getP2ChatService() {
        return service;
    }
}
