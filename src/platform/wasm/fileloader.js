export function loadBuffer(name, buffer) {
  const nameWithPath = '/data/games/' + name;
  window.Module.FS.writeFile(nameWithPath, new Uint8Array(buffer));
  window.Module.loadFile(nameWithPath);
}

export function loadFile(romFile) {
  var reader = new FileReader();
  reader.onload = function(e) {
    loadBuffer(romFile.name, e.target.result);
  }
  reader.readAsArrayBuffer(romFile);
}

// TODO save to localStorage on unload, beforeunload, and/or pagehide events
// https://wd.imgix.net/image/kheDArv5csY6rvQUJDbWRscckLr1/Hs3H9gK98YT0pvvU3k25.png
// Maybe pagehide would be best...? https://stackoverflow.com/a/31039609
// Or maybe we could just save to localStorage every couple seconds if it doesnt hurt performance.
// Would also be good to get a signal from mGBA when the game is saved from within the game.
export function saveFile(a) {
  var save = window.Module.getSave();
  a.download = window.Module.saveName;
  var blob = new Blob([save], { type: 'application/octet-stream' });
  a.href = URL.createObjectURL(blob);
  setTimeout(function() {
    URL.revokeObjectURL(a.href);
    a.href = '#';
  }, 0);
}
