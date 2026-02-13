#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "== audit:checkout =="
echo "commit: $(git rev-parse --short HEAD)"
echo

echo "== 1) Frontend must NOT reference secret env vars =="
if rg -n "SUPABASE_SERVICE_ROLE|SERVICE_ROLE_KEY|PAYTABS_SERVER_KEY|PAYTABS_PROFILE_ID" src ; then
  echo
  echo "FAIL: secret env var names referenced in src/"
  exit 1
else
  echo "OK"
fi
echo

echo "== 2) Build =="
npm run build
echo

echo "== 3) dist bundle must NOT contain key-ish strings =="
# Note: env var NAMES in dist are also undesirable, so we scan for them too.
if rg -n "SUPABASE_SERVICE_ROLE|SERVICE_ROLE_KEY|PAYTABS_SERVER_KEY|sbp_|eyJ" dist ; then
  echo
  echo "FAIL: suspicious strings found in dist/"
  exit 1
else
  echo "OK"
fi
echo

echo "== 4) Checkout/Payments files existence =="
ls -la \
  src/pages/CheckoutPage.tsx \
  src/pages/PaymentReturnPage.tsx \
  src/hooks/useMyPayments.ts \
  functions/api/paytabs/create.ts \
  functions/api/paytabs/callback.ts \
  functions/api/paytabs/query.ts \
  >/dev/null
echo "OK"
echo

echo "== 5) Quick grep: payments writes live only in expected places =="
rg -n "from\\('payments'\\)|\\.insert\\(|\\.upsert\\(|\\.update\\(" src functions || true
echo
echo "DONE: audit:checkout"
