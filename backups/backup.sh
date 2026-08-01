#!/bin/sh

set -e

DATE=$(date +%F-%H-%M)

DATABASES="
accounts_db
products_db
order_db
cart_db
payment_db
"

for DB in $DATABASES
do
    pg_dump \
        -h "$DB" \
        -p 5432 \
        -U postgres \
        "$DB" \
        | gzip > /backups/"${DATE}"-"${DB}".sql.gz
done

# Delete backups older than 7 days
find /backups -type f -mtime +7 -delete