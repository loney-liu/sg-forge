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
	  var revit_win_path = response.data.attributes.sg_file_link.local_path_windows;
	  var revit_mac_path = response.data.attributes.sg_file_link.local_path_mac;
	  $('body').append(revit_mac_path);
	  $('body').append("<br>");
	  $('body').append(revit_win_path);
	});
});
