export function loadBuffer(name, buffer) {
  Module.FS.writeFile(name, new Uint8Array(buffer));
  Module.loadFile(name);
}

export function loadFile(romFile) {
  var reader = new FileReader();
  reader.onload = function(e) {
    loadBuffer(romFile.name, e.target.result);
  }
  reader.readAsArrayBuffer(romFile);
}

export function saveFile(a) {
  var save = Module.getSave();
  a.download = Module.saveName;
  var blob = new Blob([save], { type: 'application/octet-stream' });
  a.href = URL.createObjectURL(blob);
  setTimeout(function() {
    URL.revokeObjectURL(a.href);
    a.href = '#';
  }, 0);
}
