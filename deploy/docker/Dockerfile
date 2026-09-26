# Self-hosting "virtual appliance" for nooyouniverse.com.
#
# Cloudflare (Workers static-assets, see /wrangler.jsonc) remains the canonical
# deployment. This image is for running the identical static site on any
# Docker host, with the same clean-URL routing, 404 handling and security
# headers, via deploy/docker/nginx.conf.

FROM nginxinc/nginx-unprivileged:1.27-alpine

# Runs as the built-in unprivileged "nginx" user on port 8080 (no root needed).
COPY deploy/docker/nginx.conf /etc/nginx/nginx.conf
COPY public/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
