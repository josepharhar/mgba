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

#(cd src/platform/wasm && python3 -m http.server)
