// ==UserScript==
// @name content
// @include http://*
// @include https://*
// @require jquery-1.9.1.min.js
// ==/UserScript==

kango.addMessageListener('Background2Content', function(event) {
    var interests = event.data;//JSON.parse(event.data);
	var parentUrl = interests.ParentUrl;
	kango.console.log(parentUrl);
	var details = interests.Details;
	var chunk = 5;
	var index = 0;
	
	function doChunk() {
		var cnt = chunk;
		while (cnt-- && index < details.length) {
			var name = details[index].Name;
			var url = parentUrl + details[index].Url;
			var link = "<a href=\"" + url + "\" target=\"_blank\">" + name + "</a>";
			kango.console.log("Checking for " + name);
			var regex = new RegExp(name, "gi");
			
			$("p").html(function () {
				return $(this).html().replace(regex, link);
			});
			
			++index;
		}
		
		if (index < details.length) {
			setTimeout(doChunk, 1);
		}
	}

	doChunk();
});