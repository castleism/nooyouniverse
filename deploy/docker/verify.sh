#!/usr/bin/env bash
# Verifies a running noo-site instance behaves like the Cloudflare deployment.
# Usage: BASE_URL=http://127.0.0.1:8080 deploy/docker/verify.sh

set -u
BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"

pass=0
fail=0
rows=()

check() {
    local name="$1" expected_status="$2" url="$3"
    shift 3
    local tmp
    tmp="$(mktemp)"
    local status
    status="$(curl -s -o "$tmp" -D "${tmp}.h" -w '%{http_code}' "$url")"

    local ok=1
    if [ "$status" != "$expected_status" ]; then
        ok=0
    fi

    # Optional extra assertions: name=value pairs checking header (H:) or body (B:) substrings.
    for extra in "$@"; do
        case "$extra" in
            H:*)
                local needle="${extra#H:}"
                grep -qi -- "$needle" "${tmp}.h" || ok=0
                ;;
            B:*)
                local needle="${extra#B:}"
                grep -q -- "$needle" "$tmp" || ok=0
                ;;
        esac
    done

    if [ "$ok" -eq 1 ]; then
        pass=$((pass + 1))
        rows+=("PASS|$name|$url|status=$status")
    else
        fail=$((fail + 1))
        rows+=("FAIL|$name|$url|status=$status (expected $expected_status)")
    fi

    rm -f "$tmp" "${tmp}.h"
}

check "home page"            200 "$BASE_URL/"
check "clean URL /log"       200 "$BASE_URL/log"
check "manifest"             200 "$BASE_URL/manifest.webmanifest" "H:Content-Type: application/manifest+json"
check "service worker"       200 "$BASE_URL/sw.js"
check "offline page"         200 "$BASE_URL/offline.html"
check "_headers hidden"      404 "$BASE_URL/_headers"
check "deploy-poke hidden"   404 "$BASE_URL/.deploy-poke"
check "unknown route 404"    404 "$BASE_URL/nope" "B:isn't on the star chart"
check "CSP header present"   200 "$BASE_URL/" "H:Content-Security-Policy:"
check "nosniff header present" 200 "$BASE_URL/" "H:X-Content-Type-Options: nosniff"

printf '\n%-4s  %-24s  %-30s  %s\n' "" "CHECK" "URL" "DETAIL"
for row in "${rows[@]}"; do
    IFS='|' read -r result name url detail <<< "$row"
    printf '%-4s  %-24s  %-30s  %s\n' "$result" "$name" "$url" "$detail"
done

echo
echo "Passed: $pass  Failed: $fail"

if [ "$fail" -gt 0 ]; then
    exit 1
fi
exit 0
