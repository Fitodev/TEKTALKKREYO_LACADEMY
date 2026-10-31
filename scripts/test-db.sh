#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
db_test_container="tektalk-db-test-${RANDOM}-$$"
trap 'docker rm -f "$db_test_container" >/dev/null 2>&1 || true' EXIT
docker run --name "$db_test_container" --detach --network none -e POSTGRES_HOST_AUTH_METHOD=trust postgres:17-bookworm >/dev/null
for attempt in {1..30}; do
  if docker exec "$db_test_container" pg_isready -U postgres >/dev/null 2>&1; then break; fi
  if [ "$attempt" -eq 30 ]; then echo 'PostgreSQL did not become ready' >&2; exit 1; fi
  sleep 1
done
run_sql() { docker exec -i "$db_test_container" psql -U postgres -v ON_ERROR_STOP=1 -q < "$1"; }
run_sql tests/sql/bootstrap.sql
for migration in supabase/migrations/*.sql; do run_sql "$migration"; done
run_sql supabase/seed.sql
run_sql supabase/seed.sql
run_sql tests/sql/assertions.sql
