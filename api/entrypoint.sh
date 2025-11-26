#!/bin/sh
set -e

MAX_TRIES=20
SLEEP_SECONDS=3
COUNT=1

until npm run prisma:db:push
do
  if [ "$COUNT" -ge "$MAX_TRIES" ]; then
    echo "Prisma db push falhou após ${COUNT} tentativas. Abortando."
    exit 1
  fi
  echo "Banco ainda não está pronto (tentativa ${COUNT}/${MAX_TRIES}). Aguardando ${SLEEP_SECONDS}s..."
  COUNT=$((COUNT + 1))
  sleep "$SLEEP_SECONDS"
done

exec "$@"
