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
