# Self-hosted mirror (Docker)

Optional self-host path. Cloudflare Workers (see `/wrangler.jsonc`) remains
the canonical deployment; use this to run an identical mirror on any Docker
host.

## Build

```sh
docker build -t noo-site -f deploy/docker/Dockerfile .
```

(Run from the repo root — the build context must be the repo root so it can
copy `public/`.)

## Run

```sh
docker run -d -p 8080:8080 --name noo-site noo-site
# or: docker compose -f deploy/docker/docker-compose.yml up -d
```

## Verify

```sh
BASE_URL=http://127.0.0.1:8080 deploy/docker/verify.sh
```
