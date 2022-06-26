Module.loadFile = (function() {
	var loadGame = cwrap('loadGame', 'number', ['string']);
	return function(name) {
		if (loadGame(name)) {
			var arr = name.split('.');
			arr.pop();
			Module.gameName = name;
			Module.saveName = arr.join('.') + '.sav';
			return true;
		}
		return false;
	}
})();
Module.getSave = function() {
  // TODO also do save states here somehow...
	return FS.readFile('/data/saves/' + Module.saveName);
}
console.log('pre.js window: ', window);
console.log('pre.js this: ', this);
console.log('pre.js Module: ', Module);
