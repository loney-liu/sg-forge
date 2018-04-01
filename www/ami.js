$(document).ready(function () {
	var selected_id = getParameterByName('selected_id');
	var token_type = getParameterByName('token_type');
	var access_token = getParameterByName('access_token');
    var SGAuth = "{0} {1}".format(token_type, access_token);

	console.log(selected_id)

	var asset_url = "https://jing.shotgunstudio.com/api/v1/entity/assets/{0}".format(selected_id);
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": asset_url,
	  "method": "GET",
	  "headers": {
	    "Authorization": SGAuth,
	    "Cache-Control": "no-cache",
	    "Postman-Token": "c790d158-4a7e-45b3-9fe1-2ed954ee4c08"
	  }          
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  var code = response.data.attributes.code;
	  $('body').append(code);
	});
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};