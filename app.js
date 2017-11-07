chrome.storage.sync.get("secretKey", function(items) {
	let priv;
	if (!items.secretKey){
		priv = genKey()
		chrome.storage.sync.set({ "secretKey" :nacl.util.encodeBase64(priv) }, function() {
			if (chrome.runtime.error) {
				console.log("Runtime error.");
			}
		});
	} else {
		priv = nacl.util.decodeBase64(items.secretKey)
	}
	let pair = nacl.sign.keyPair.fromSecretKey(priv)
	let encodedKey = nacl.util.encodeBase64(pair.publicKey)
	console.log(encodedKey)
	document.getElementById('public-key').textContent = encodedKey
});


