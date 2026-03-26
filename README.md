# 🚀 safeDeploy demo application

A minimal TypeScript + Express service used to demonstrate **SafeDeploy** patterns such as health checks, controlled failures, synthetic latency, and Prometheus metrics.

## ✨ Features

- ✅ `GET /health` returns a healthy response for readiness/liveness checks.
- 🐢 `GET /slow` simulates a slow dependency by waiting ~3 seconds.
- 💥 `GET /error` intentionally returns `500` for failure-path testing.
- ➕ `GET /sum` increments and returns an in-memory counter.
- 📈 `GET /metrics` exposes Prometheus metrics (default process metrics + custom HTTP metrics).

## 🧰 Tech stack

- Node.js
- TypeScript
- Express
- Vitest + Supertest
- prom-client

## 📋 Prerequisites

- Node.js 20+ (recommended)
- npm

## ⚡ Getting started

```bash
npm install
npm run build
npm start
```

The app starts on `http://0.0.0.0:3000`.

## 🛠️ Development

```bash
npm run dev
```

## 🧪 Testing

```bash
npm test -- --run
```

## ☸️ Kubernetes runtime notes

This service is intended to run in a Kubernetes environment as a Pod (for example, as a canary and/or stable workload behind a Service).

When deployed to Kubernetes, the endpoints in this README can be used for:

- health verification (`/health`)
- failure-path validation (`/error`)
- synthetic latency checks (`/slow`)
- metrics scraping (`/metrics`)

## 🔁 CI/CD pipeline notes

This repository is designed to fit into a CI/CD workflow where pipelines typically:

1. install dependencies
2. run tests
3. build the TypeScript bundle
4. build and push a container image to **GHCR** (GitHub Container Registry)
5. publish/deploy via a **GitOps** flow to Kubernetes

A common command sequence in CI is:

```bash
npm ci
npm test -- --run
npm run build
```

In a GitOps setup, deployment state is tracked in Git, and the cluster continuously reconciles to the desired manifests that reference the image stored in GHCR.

## 🐌 Manual slow deployment test (current workaround)

> ℹ️ SafeDeploy is still under active development, so slow rollout behavior is tested manually for now.

Start a temporary curl pod in Kubernetes:

```bash
kubectl run curltest \
  --rm -it \
  --image=curlimages/curl \
  --restart=Never -- sh
```

Then issue repeated requests to the canary app's slow endpoint:

```bash
for i in {1..20}; do
  curl http://demo-app-canary:3000/slow
done
```

## 🔎 API quick reference

### ✅ `GET /health`

```json
{ "status": "ok - Application reached" }
```

### 🐢 `GET /slow`

```json
{ "status": "slow", "delayMs": 3000 }
```

### 💥 `GET /error`

```json
{ "status": "error", "message": "Intentional error for SafeDeploy demo" }
```

### ➕ `GET /sum`

```json
{ "status": "sum", "sum": 1 }
```

### 📈 `GET /metrics`

Returns Prometheus-formatted metrics, including:

- `http_request_duration_seconds`
- `http_requests_total{status="..."}`
- default Node/process metrics
