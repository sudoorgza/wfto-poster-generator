cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore sudo-android.keystore ./platforms/android/build/outputs/apk/android-release-unsigned.apk wfto-poster
~/Library/Android/sdk/build-tools/23.0.2/zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./WftoPoster.apk
