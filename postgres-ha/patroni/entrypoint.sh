#!/bin/bash
set -e

DATA_DIR="/var/lib/postgresql/data"

chown -R postgres:postgres "$DATA_DIR"
chmod 700 "$DATA_DIR"

exec gosu postgres patroni /etc/patroni.yml