#!/bin/bash
set -e

rm -rf /var/lib/postgresql/data/*

PGPASSWORD=replica_pass pg_basebackup \
  -h order_db \
  -D /var/lib/postgresql/data \
  -U replicator \
  -Fp \
  -Xs \
  -P \
  -R