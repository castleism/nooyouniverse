param(
    [Parameter(Mandatory=$true)][string]$KeystoreProperties,
    [string]$SdkRoot = "$env:LOCALAPPDATA\Android\Sdk"
)
$ErrorActionPreference = 'Stop'
$mobileRoot = Split-Path $PSScriptRoot -Parent
$propertiesPath = (Resolve-Path -LiteralPath $KeystoreProperties).Path
$signing = @{}
foreach ($line in [IO.File]::ReadAllLines($propertiesPath)) {
    if ($line -match '^\s*([^#!][^=]*)=(.*)$') { $signing[$matches[1].Trim()] = $matches[2].Trim() }
}
$keyFile = $signing.storeFile.Replace('\\', '\')
if (-not [IO.Path]::IsPathRooted($keyFile)) { $keyFile = Join-Path (Split-Path $propertiesPath -Parent) $keyFile }
if (-not (Test-Path -LiteralPath $keyFile)) { throw 'Signing key file does not exist.' }
$buildTools = Join-Path $SdkRoot 'build-tools\36.0.0'
$unsigned = Join-Path $mobileRoot 'android\app\build\outputs\apk\release\app-release-unsigned.apk'
$output = Join-Path $mobileRoot 'dist\noo-observation-log-0.2.1-release.apk'
New-Item -ItemType Directory -Force (Split-Path $output -Parent) | Out-Null
& "$buildTools\zipalign.exe" -f -p 4 $unsigned $output
if ($LASTEXITCODE -ne 0) { throw 'APK alignment failed.' }
try {
    $env:NOO_SIGN_STORE = $signing.storePassword
    $env:NOO_SIGN_KEY = $signing.keyPassword
    & "$buildTools\apksigner.bat" sign --ks $keyFile --ks-key-alias $signing.keyAlias --ks-pass env:NOO_SIGN_STORE --key-pass env:NOO_SIGN_KEY $output
    if ($LASTEXITCODE -ne 0) { throw 'APK signing failed.' }
} finally {
    Remove-Item Env:NOO_SIGN_STORE,Env:NOO_SIGN_KEY -ErrorAction SilentlyContinue
}
& "$buildTools\apksigner.bat" verify --print-certs $output
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed.' }
Get-FileHash -LiteralPath $output -Algorithm SHA256
# Deliberately no adb, installation, upload, or key generation.
