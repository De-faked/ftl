#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "== doctor:checkout =="
echo

echo "-- 1) audit (local) --"
bash scripts/audit_checkout.sh

echo
echo "-- 2) smoke (production) --"
bash scripts/smoke_prod_checkout.sh

echo
echo "OK: doctor:checkout finished."
