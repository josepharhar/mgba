#!/bin/bash
set -e
set -x

rm -rf build-wasm
docker run --rm -t -v $PWD:/home/mgba/src mgba/wasm

cp build-wasm/wasm/mgba.js src/platform/wasm
cp build-wasm/wasm/mgba.wasm src/platform/wasm

#(cd src/platform/wasm && python3 -m http.server)
