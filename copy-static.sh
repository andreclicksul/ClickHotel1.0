#!/bin/sh
set -e

SRC="/app/res"
DEST="/var/www/html"

if [ -d "$SRC" ]; then
  mkdir -p "$DEST"
  rsync -a "$SRC" "$DEST" --delete
fi
