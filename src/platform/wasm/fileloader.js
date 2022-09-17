export function loadGame(filepath) {
	const cLoadGame = window.Module.cwrap('loadGame', 'number', ['string']);
  if (cLoadGame(filepath)) {
    const arr = filepath.split('.');
    arr.pop();
    window.Module.gameName = name;
    window.Module.saveName = arr.join('.') + '.sav';
  } else {
    console.log('Module._loadGame returned false!');
  }
}

export async function saveFile(filepath, file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.Module.FS.writeFile(
        filepath, new Uint8Array(e.target.result));
      resolve();
    }
    reader.readAsArrayBuffer(romFile);
  });
}

export function loadFile(romFile) {
  var reader = new FileReader();
  reader.onload = function(e) {
    const nameWithPath = '/data/games/' + romFile.name;
    window.Module.FS.writeFile(
      nameWithPath, new Uint8Array(e.target.result));
  }
  reader.readAsArrayBuffer(romFile);
}

// TODO find a way to export files and delet this
/*export function saveFile(a) {
  const save = window.Module.FS.readFile('/data/saves/' + window.Module.saveName);
  a.download = window.Module.saveName;
  const blob = new Blob([save], { type: 'application/octet-stream' });
  a.href = URL.createObjectURL(blob);
  setTimeout(function() {
    URL.revokeObjectURL(a.href);
    a.href = '#';
  }, 0);
}*/

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
