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

export async function readfs() {
  const err = await new Promise(resolve => {
    window.Module.FS.syncfs(/*populate=*/true, resolve);
  });
  if (err)
    console.log('syncfs error: ', err);
}

export async function writefs() {
  const err = await new Promise(resolve => {
    window.Module.FS.syncfs(/*populate=*/false, resolve);
  });
  if (err)
    console.log('syncfs error: ', err);
}
