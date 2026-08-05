FROM postgres:15

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 \
       python3-pip \
       curl \
    && pip3 install --break-system-packages "patroni[psycopg3,etcd3]" \
    && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /usr/local/bin/patroni-entrypoint.sh

RUN chmod +x /usr/local/bin/patroni-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/patroni-entrypoint.sh"]