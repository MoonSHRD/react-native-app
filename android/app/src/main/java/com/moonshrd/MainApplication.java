package com.moonshrd;

import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.facebook.react.ReactApplication;
import com.moonshrd.services.P2ChatService;
import com.moonshrd.utils.matrix.Matrix;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.matrix.androidsdk.MXSession;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import io.realm.Realm;
import io.realm.RealmConfiguration;

public class MainApplication extends Application implements ReactApplication {
  private static Matrix matrixInstance = null;

  public static final String SERVICE_TOPIC = "moonshard";
  public static final String PROTOCOL_ID = "/moonshard/1.0.0";
    public static ServiceConnection serviceConnection = null;
    public static P2ChatService service = null;
    public Context context = null;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RNGestureHandlerPackage(),
            new LinearGradientPackage(),
            new MatrixClientPackage()
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
    SoLoader.init(this, /* native exopackage */ false);
    matrixInstance = Matrix.getInstance(getApplicationContext());

      context = getApplicationContext();

      this.context.startService(new Intent(this.context, P2ChatService.class));

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

      this.context.bindService(new Intent(this.context, P2ChatService.class), serviceConnection, Context.BIND_AUTO_CREATE);
  }

  public static Matrix getMatrixInstance() {
    return matrixInstance;
  }

  public static Realm getCredsRealmInstance() {
    RealmConfiguration realmCredsConfig = new RealmConfiguration.Builder()
            .name("realm.creds")
            //.encryptionKey() // TODO: DB encryption
            .schemaVersion(0)
            //.migration(new MyMigration()) // TODO: DB migration
            .build();
    return Realm.getInstance(realmCredsConfig);
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
}
