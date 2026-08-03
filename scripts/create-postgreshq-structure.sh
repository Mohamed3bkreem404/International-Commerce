#!/bin/bash

mkdir -p postgres-ha/{primary,standby,scripts}

cd postgres-ha

touch docker-compose.yml \
      .env \
      primary/postgresql.conf \
      primary/pg_hba.conf \
      standby/postgresql.conf \
      standby/pg_hba.conf \
      scripts/init-primary.sh \
      scripts/init-standby.sh \
      README.md