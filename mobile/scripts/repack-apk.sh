#!/usr/bin/env bash
# Repack the Android APK WITHOUT Gradle/AGP.
#
# Why this exists: the Java side of this app is ~200 lines and changes rarely,
# while the bundled web assets (assets/site, assets/www) change on every
# mission publish. In an environment where dl.google.com (Android SDK + AGP)
# is unreachable, a full Gradle build is impossible, but everything else is
# not: aapt2 + android.jar rebuild the manifest/resources, the compiled dex is
# reused from the last Gradle build, assets are re-bundled from source, and
# the result is zipaligned and signed.
#
# Requirements (all obtainable without dl.google.com):
#   AAPT2, ZIPALIGN   static builds  https://github.com/lzhiyong/android-sdk-tools
#   ANDROID_JAR       android-34     https://github.com/Sable/android-platforms
#   SIGNER_JAR        uber-apk-signer https://github.com/patrickfav/uber-apk-signer
#   BASE_APK          the last Gradle-built APK (source of classes*.dex)
#
# Usage:
#   VERSION_CODE=2 VERSION_NAME=0.2.0 \
#   KS=/path/release.jks KS_ALIAS=noo KS_PASS=... \
#   mobile/scripts/repack-apk.sh out.apk
#
# Set RELEASE=1 to (a) drop android:debuggable and (b) flip BuildConfig.DEBUG
# to false inside the reused dex (see patch_buildconfig below). Without
# RELEASE=1 the output is a debug repack with the debug intent hooks alive.
set -euo pipefail
OUT=${1:?output apk path}
HERE=$(cd "$(dirname "$0")/.." && pwd)              # mobile/
SRC=$HERE/android/app/src/main
: "${AAPT2:=aapt2}" "${ZIPALIGN:=zipalign}" "${ANDROID_JAR:?}" "${SIGNER_JAR:?}"
: "${BASE_APK:=$HERE/dist/noo-observation-log-debug.apk}"
: "${VERSION_CODE:=1}" "${VERSION_NAME:=0.1.0}" "${RELEASE:=0}"
: "${APP_ID:=com.nooyouniverse.observationlog}"
W=$(mktemp -d)
trap 'rm -rf "$W"' EXIT

# 1. Refresh web assets from source (catalog, www, offline site copy).
(cd "$HERE" && npm run -s prepare-web >/dev/null)

# 2. Manifest: inject package (AGP normally does this) and debuggable flag.
python3 - "$SRC/AndroidManifest.xml" "$W/AndroidManifest.xml" "$APP_ID" "$RELEASE" <<'EOF'
import sys,re
src,dst,pkg,release=sys.argv[1:]
m=open(src,encoding='utf-8').read()
m=m.replace('<manifest xmlns:android="http://schemas.android.com/apk/res/android">',
            f'<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="{pkg}">',1)
dbg='false' if release=='1' else 'true'
m=m.replace('<application\n', f'<application\n        android:debuggable="{dbg}"\n',1)
open(dst,'w',encoding='utf-8').write(m)
EOF

# 3. Resources + manifest via aapt2.
"$AAPT2" compile --dir "$SRC/res" -o "$W/res.zip"
"$AAPT2" link -o "$W/base.apk" -I "$ANDROID_JAR" --manifest "$W/AndroidManifest.xml" \
  -R "$W/res.zip" --auto-add-overlay \
  --min-sdk-version 24 --target-sdk-version 34 \
  --version-code "$VERSION_CODE" --version-name "$VERSION_NAME"

# 4. Reuse compiled dex from the last Gradle build; optionally flip DEBUG.
mkdir -p "$W/dex" && (cd "$W/dex" && unzip -q "$BASE_APK" 'classes*.dex')
if [ "$RELEASE" = "1" ]; then
python3 - "$W/dex" <<'EOF'
# patch_buildconfig: AGP emits  DEBUG = Boolean.parseBoolean("true")  so the
# value lives in the dex string pool, not as an inlined constant. Rewriting
# that literal to a same-length string that is not "true" makes parseBoolean
# return false. "trux" keeps the string table's required sort order between
# its neighbours. Header checksum + SHA-1 are then recomputed.
import sys,struct,glob,hashlib,zlib
for f in glob.glob(sys.argv[1]+'/classes*.dex'):
    d=bytearray(open(f,'rb').read())
    n,off=struct.unpack_from('<II',d,0x38)
    hit=False
    for i in range(n):
        p=struct.unpack_from('<I',d,off+4*i)[0]
        while d[p]&0x80: p+=1
        p+=1
        if d[p:p+5]==b'true\0':
            d[p:p+4]=b'trux'; hit=True
    if not hit: continue
    struct.pack_into('<20s',d,12,hashlib.sha1(d[32:]).digest())
    struct.pack_into('<I',d,8,zlib.adler32(bytes(d[12:]))&0xffffffff)
    open(f,'wb').write(d); print('BuildConfig.DEBUG -> false in',f)
EOF
fi

# 5. Assemble: base (manifest/res/arsc) + dex + assets, then align + sign.
python3 - "$W/base.apk" "$W/dex" "$SRC/assets" "$W/unsigned.apk" <<'EOF'
import sys,zipfile,os
base,dexdir,assets,out=sys.argv[1:]
with zipfile.ZipFile(base) as zb, zipfile.ZipFile(out,'w') as zo:
    for info in zb.infolist():
        zo.writestr(info, zb.read(info.filename))      # keeps arsc stored
    for f in sorted(os.listdir(dexdir)):
        zo.write(os.path.join(dexdir,f), f, zipfile.ZIP_DEFLATED)
    for root,_,files in os.walk(assets):
        for f in sorted(files):
            p=os.path.join(root,f); arc='assets/'+os.path.relpath(p,assets).replace(os.sep,'/')
            zo.write(p, arc, zipfile.ZIP_DEFLATED)
EOF
"$ZIPALIGN" -p -f 4 "$W/unsigned.apk" "$W/aligned.apk"
if [ -n "${KS:-}" ]; then
  java -jar "$SIGNER_JAR" --apks "$W/aligned.apk" --allowResign --overwrite \
    --ks "$KS" --ksAlias "$KS_ALIAS" --ksPass "$KS_PASS" --ksKeyPass "${KS_KEY_PASS:-$KS_PASS}" >/dev/null
else
  java -jar "$SIGNER_JAR" --apks "$W/aligned.apk" --allowResign --overwrite --debug >/dev/null
fi
cp "$W/aligned.apk" "$OUT"
java -jar "$SIGNER_JAR" --verify --apks "$OUT" | grep -E 'VERIFY|v1|v2|v3|CN=' || true
"$AAPT2" dump badging "$OUT" | grep -E "^package|sdkVersion|targetSdk|launchable" || true
echo "wrote $OUT"
