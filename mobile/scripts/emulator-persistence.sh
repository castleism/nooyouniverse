#!/usr/bin/env bash
# Debug-only: seed an observation, force-stop, dump. Requires Android SDK + KVM.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
PKG="com.nooyouniverse.observationlog.debug"
ACTIVITY="com.nooyouniverse.observationlog.MainActivity"
AVD="${NOO_AVD_NAME:-noo_api34}"
APK="$ROOT/mobile/dist/noo-observation-log-debug.apk"
PROBE_HOST="/tmp/noo-probe.json"

if [[ ! -x "$ANDROID_HOME/emulator/emulator" ]]; then
  echo "SKIP: emulator binary missing under $ANDROID_HOME"
  exit 0
fi
if [[ ! -f "$APK" ]]; then
  echo "Building debug APK first"
  echo "sdk.dir=$ANDROID_HOME" > "$ROOT/mobile/android/local.properties"
  (cd "$ROOT/mobile/android" && ./gradlew :app:assembleDebug --no-daemon)
  cp "$ROOT/mobile/android/app/build/outputs/apk/debug/app-debug.apk" "$APK"
fi

if ! avdmanager list avd | grep -q "$AVD"; then
  echo "Creating AVD $AVD"
  echo "no" | avdmanager create avd -n "$AVD" -k "system-images;android-34;google_apis;x86_64" --force
fi

if ! adb devices | grep -q emulator; then
  echo "Starting emulator $AVD"
  "$ANDROID_HOME/emulator/emulator" -avd "$AVD" -no-window -no-audio -no-boot-anim \
    -gpu swiftshader_indirect -accel on -no-snapshot-load >/tmp/noo-emulator.log 2>&1 &
  echo $! > /tmp/noo-emulator.pid
fi

echo "Waiting for boot"
if ! adb wait-for-device; then
  echo "SKIP: adb never saw a device (KVM/emulator failed). Phone sideload remains owner-only."
  exit 0
fi
booted=0
for i in $(seq 1 90); do
  boot="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
  if [[ "$boot" == "1" ]]; then
    booted=1
    break
  fi
  sleep 2
done
if [[ "$booted" != "1" ]]; then
  echo "SKIP: emulator did not reach boot_completed. See /tmp/noo-emulator.log"
  tail -n 40 /tmp/noo-emulator.log || true
  exit 0
fi
sleep 4

adb install -r "$APK"
adb shell am force-stop "$PKG" || true
rm -f "$PROBE_HOST"
adb shell rm -f "/sdcard/Android/data/$PKG/files/noo-probe.json" || true

adb shell am start -n "$PKG/$ACTIVITY" -e noo_debug_cmd seed
sleep 5
adb pull "/sdcard/Android/data/$PKG/files/noo-probe.json" "$PROBE_HOST" >/dev/null
echo "SEED $(cat "$PROBE_HOST")"
grep -q '"phase":"seed"' "$PROBE_HOST"
grep -q '"ok":true' "$PROBE_HOST"

adb shell am force-stop "$PKG"
sleep 2
adb shell am start -n "$PKG/$ACTIVITY" -e noo_debug_cmd dump
sleep 5
adb pull "/sdcard/Android/data/$PKG/files/noo-probe.json" "$PROBE_HOST" >/dev/null
echo "DUMP $(cat "$PROBE_HOST")"
grep -q '"phase":"dump"' "$PROBE_HOST"
grep -q '"ok":true' "$PROBE_HOST"
grep -q 'process-death probe' "$PROBE_HOST"
grep -q 'noo-private-observation-log' "$PROBE_HOST"
echo "EMULATOR_PERSISTENCE_OK"
