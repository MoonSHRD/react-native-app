package com.moonshrd;

import android.app.Application;

import com.facebook.react.ReactApplication;
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
