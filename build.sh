#!/bin/bash
set -e
set -x

#rm -rf build-wasm
#docker run --rm -t -v $PWD:/home/mgba/src mgba/wasm

if [ ! -d "build-wasm" ]
then
  # running cmake with this file already here consistently makes the build fail
  rm -rf $HOME/emsdk/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/libSDL2.a
  mkdir build-wasm
  cd build-wasm
  source $HOME/emsdk/emsdk_env.sh
  emcmake cmake ..
else
  cd build-wasm
fi

make -j4 install DESTDIR=install
cd ..

mkdir -p src/platform/wasm/build
cp build-wasm/wasm/mgba.js src/platform/wasm/build
cp build-wasm/wasm/mgba.wasm src/platform/wasm/build

cp src/platform/wasm/serviceworker.js src/platform/wasm/build/serviceworker.js
cp src/platform/wasm/version.js src/platform/wasm/build/version.js

COMMIT=$(git rev-parse --short HEAD)
sed -i '' -e s/GITCOMMIT/${COMMIT}/g src/platform/wasm/build/serviceworker.js
sed -i '' -e s/GITCOMMIT/${COMMIT}/g src/platform/wasm/build/version.js

VERSION=`cat src/platform/wasm/build/VERSION`
sed -i '' -e s/MGBAVERSION/${VERSION}/g src/platform/wasm/build/version.js

#(cd src/platform/wasm && python3 -m http.server)
