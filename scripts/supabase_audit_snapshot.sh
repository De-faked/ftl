#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/supabase_audit_snapshot.sh
# Requires:
#   - psql available
#   - access to Supabase via pooler host (IPv4)
#   - PGPASSWORD set in environment OR will prompt interactively
#
# Output:
#   supabase/audit/snapshot.md

REF="${SUPABASE_PROJECT_REF:-yakujiwzshkkuvoqikbh}"
POOLER_HOST="${SUPABASE_POOLER_HOST:-aws-1-ap-south-1.pooler.supabase.com}"
POOLER_PORT="${SUPABASE_POOLER_PORT:-5432}"
POOLER_DB="${SUPABASE_DB:-postgres}"
POOLER_USER="${SUPABASE_DB_USER:-postgres.${REF}}"

IPV4="$(getent ahosts "$POOLER_HOST" | awk '$1 ~ /^[0-9]+\./ {print $1; exit}')"

if [[ -z "${IPV4}" ]]; then
  echo "ERROR: Could not resolve IPv4 for ${POOLER_HOST}" >&2
  exit 1
fi

if [[ -z "${PGPASSWORD:-}" ]]; then
  read -s -p "Supabase DB password: " PGPASSWORD
  echo
  export PGPASSWORD
fi

export PGSSLMODE=require
export PGCONNECT_TIMEOUT=10

OUT="supabase/audit/snapshot.md"
TMP="$(mktemp)"

psql_cmd() {
  PGHOSTADDR="$IPV4" psql -h "$POOLER_HOST" -p "$POOLER_PORT" -U "$POOLER_USER" -d "$POOLER_DB" -v ON_ERROR_STOP=1 -Atc "$1"
}

{
  echo "# Supabase Security Snapshot"
  echo
  echo "- Generated (UTC): $(date -u '+%Y-%m-%d %H:%M:%S')"
  echo "- Project ref: ${REF}"
  echo "- Host: ${POOLER_HOST}"
  echo

  echo "## RLS enabled tables (public)"
  echo
  psql_cmd "
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public'
      and c.relkind='r'
      and c.relrowsecurity is true
    order by c.relname;
  " | sed 's/^/- /'
  echo

  echo "## Policies (public)"
  echo
  psql_cmd "
    select
      schemaname || '.' || tablename as table,
      policyname,
      permissive,
      array_to_string(roles, ',') as roles,
      cmd,
      coalesce(qual, '') as using_expr,
      coalesce(with_check, '') as with_check
    from pg_policies
    where schemaname='public'
    order by tablename, policyname;
  " | awk -F'|' '
    BEGIN { print "| Table | Policy | Permissive | Roles | Cmd | Using | With check |"; print "|---|---|---|---|---|---|---|" }
    { gsub(/\r/,"",$0); print "| " $1 " | " $2 " | " $3 " | " $4 " | " $5 " | " $6 " | " $7 " |" }
  '
  echo

  echo "## SECURITY DEFINER functions (public)"
  echo
  psql_cmd "
    select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as signature
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.prosecdef is true
    order by signature;
  " | sed 's/^/- /'
  echo

  echo "## Key constraints / indexes (payments, applications, students, profiles)"
  echo

  for t in payments applications students profiles admin_users; do
    echo "### public.${t}"
    echo
    echo "**Constraints**"
    psql_cmd "
      select conname || ' :: ' || pg_get_constraintdef(oid)
      from pg_constraint
      where conrelid=('public.${t}'::regclass)
      order by conname;
    " | sed 's/^/- /' || true
    echo
    echo "**Indexes**"
    psql_cmd "
      select indexname || ' :: ' || indexdef
      from pg_indexes
      where schemaname='public' and tablename='${t}'
      order by indexname;
    " | sed 's/^/- /' || true
    echo
  done

  echo "## Notes"
  echo
  echo "- This snapshot is intended to be committed and reviewed in PR diffs."
  echo "- Do not include secrets. This report contains schema metadata only."
} > "$TMP"

mv "$TMP" "$OUT"
echo "Wrote $OUT"
