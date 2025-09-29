#!/bin/sh
set -e

SRC_DIR="/app/dist"
TARGET_DIR="/var/www/html"

if [ ! -d "$SRC_DIR" ]; then
  echo "Erro: diretório $SRC_DIR não encontrado. Execute o build antes de iniciar o container." >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
rm -rf "$TARGET_DIR"/*
cp -a "$SRC_DIR"/. "$TARGET_DIR"/

if [ -d "/app/res" ]; then
  mkdir -p "$TARGET_DIR/res"
  cp -a /app/res/. "$TARGET_DIR/res"/
fi

if [ -d "/app/fonts" ]; then
  mkdir -p "$TARGET_DIR/fonts"
  cp -a /app/fonts/. "$TARGET_DIR/fonts"/
fi

exec "$@"
