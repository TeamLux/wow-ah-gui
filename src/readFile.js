function read(filename)
{
	var req;
	if (window.XMLHttpRequest) {
		// Firefox, Opera, IE7, and other browsers will use the native object
		req = new XMLHttpRequest();
	} else {
		// IE 5 and 6 will use the ActiveX control
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}

	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status === 200 ||  // Normal http
				req.status === 0) {    // Chrome w/ --allow-file-access-from-files
				fullText = req.responseText;
			}
		}
	};

	req.open("GET", filename, false);
	req.send(null);
}