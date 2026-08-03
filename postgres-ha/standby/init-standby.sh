#!/bin/bash
set -e

DATA_DIR="/var/lib/postgresql/data"

if [ ! -s "$DATA_DIR/PG_VERSION" ]; then
    echo "Initializing standby from primary..."

    rm -rf "${DATA_DIR:?}"/*

    PGPASSWORD=replica_pass pg_basebackup \
        -h order_db \
        -p 5432 \
        -U replicator \
        -D "$DATA_DIR" \
        -Fp \
        -Xs \
        -P \
        -R
fi

echo "Starting PostgreSQL standby..."

exec postgres