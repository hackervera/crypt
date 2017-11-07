function genKey(){
	let pair = nacl.sign.keyPair()
	return pair.secretKey
}


function callFunc(cb, keyInfo){
	var script = document.createElement('script');
	var str = '(function() {'+cb+'('+keyInfo+')})();'
	var code = document.createTextNode(str);
	script.appendChild(code);
	(document.body || document.head).appendChild(script);
}

window.addEventListener("message", function(event) {
	if(event.data.type === "key-challenge"){
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
			let msg = nacl.util.decodeUTF8(event.data.text)
			let sig = nacl.sign.detached(msg, priv)
			callFunc(event.data.callback,JSON.stringify({challenge: event.data.text, sig: nacl.util.encodeBase64(sig), publicKey: nacl.util.encodeBase64(pair.publicKey)}))
		});
	}
});