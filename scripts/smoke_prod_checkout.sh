#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-https://ftl.ptdima.sa}"

echo "== smoke:prod =="
echo "BASE=$BASE"
echo

echo "== A) endpoints that MUST require auth (expect 401/403; paytabs/create can be 503 if disabled) =="
for path in \
  "/api/paytabs/create" \
  "/api/promo/apply" \
  "/api/promo/remove"
do
  code="$(curl -sS -o /tmp/smoke.out -w "%{http_code}" \
    -X POST "$BASE$path" \
    -H "content-type: application/json" \
    -d '{}' || true)"
  echo "$path -> HTTP $code"
  head -c 220 /tmp/smoke.out; echo
  echo
done

echo "== B) endpoints that may be public but must fail safely (expect 400-ish or 503 when payments disabled) =="
for path in \
  "/api/paytabs/callback" \
  "/api/paytabs/query" \
  "/api/promo/quote"
do
  code="$(curl -sS -o /tmp/smoke.out -w "%{http_code}" \
    -X POST "$BASE$path" \
    -H "content-type: application/json" \
    -d '{}' || true)"
  echo "$path -> HTTP $code"
  head -c 220 /tmp/smoke.out; echo
  echo
done

echo "DONE: smoke:prod"
