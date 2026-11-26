#!/bin/sh
# Runs engine tests, then the browser click-through against a local static server.
set -e
cd "$(dirname "$0")/.."
node tests/engine.test.js
PORT=${PORT:-38417}
python3 -m http.server $PORT >/tmp/dayn-srv.log 2>&1 &
SRV=$!
sleep 1
trap 'kill $SRV' EXIT
node tests/browser.test.js "http://localhost:$PORT/" "$@"
