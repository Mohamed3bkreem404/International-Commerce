FROM postgres:15
RUN apt-get update && \
  apt-get install -y cron && \
  #clean apt cache to reduce image size
  rm -rf /var/lib/apt/lists/*

COPY backup.sh /backup.sh
COPY crontab /etc/cron.d/postgres-backup

RUN chmod +x /backup.sh && \
  chmod 0644 /etc/cron.d/postgres-backup && \
  crontab /etc/cron.d/postgres-backup

CMD ["cron", "-f"]