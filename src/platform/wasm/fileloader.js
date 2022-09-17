export function loadGame(filepath) {
	const cLoadGame = window.Module.cwrap('loadGame', 'number', ['string']);
  if (!cLoadGame(filepath)) {
    const message = 'Module._loadGame returned false! filepath: ' + filepath;
    console.log(message);
    throw new Error(message);
  }
}

export async function saveFile(filepath, file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = async e => {
      window.Module.FS.writeFile(
        filepath, new Uint8Array(e.target.result));
      await writefs();
      resolve();
    }
    reader.readAsArrayBuffer(file);
  });
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
