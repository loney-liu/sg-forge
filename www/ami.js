$(document).ready(function () {
	var selected_id = getParameterByName('selected_id');
	var token_type = getParameterByName('token_type');
	var access_token = getParameterByName('access_token');
    var entity_type = "assets";
    var SGAuth = "{0} {1}".format(token_type, access_token);

	console.log(selected_id)
    
	var asset_url = "https://jing.shotgunstudio.com/api/v1/entity/{0}/{1}".format(entity_type, selected_id);
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

    var objectKey = ""
    var revit_win_path = "";
    var revit_mac_path = "";
	
    $.ajax(settings).done(function (response) {
	  console.log(response);
	  var code = response.data.attributes.code;

      if (!empty(response.data.attributes.sg_forge_urn)){
        objectKey = response.data.attributes.sg_forge_urn;
      }


      if (!empty(response.data.attributes.sg_file_link)){
        if (!empty(response.data.attributes.sg_file_link.local_path_windows)){
          revit_win_path = response.data.attributes.sg_file_link.local_path_windows;
        }

        if (!empty(response.data.attributes.sg_file_link.local_path_mac)){
          revit_mac_path = response.data.attributes.sg_file_link.local_path_mac;
        }
      }
	

      jQuery.ajax({
        url: '/api/forge/oauth/token',
        success: function (res) {
          //callback(res.access_token, res.expires_in)
          $('#tokenvalue').val(res.access_token); 

          if (!empty(objectKey)){
            launchViewer(objectKey);
          }
          else{
            alert("no URN");
          }
        }, error: function (err) {
          $('#tokenvalue').val(err.responseJSON.ExceptionMessage);
        }
      }); 
    });

    $('#createbucket').click(function () {

        var bucketKey = $('#newbucketname').val(); //bucketKey="sg1"
        jQuery.post({
            url: '/api/forge/oss/buckets',
            contentType: 'application/json',
            data: JSON.stringify({ 'bucketKey': bucketKey, 'policyKey': 'persistent' }),
            success: function (res) {
                $('#buckettatus').val('succeded!');
             },
            error: function (err) {
                if (err.status == 409) 
                    $('#buckettatus').val('Bucket already exists - 409: Duplicated'); 
                else
                    $('#buckettatus').val(err.responseJSON.ExceptionMessage);
            }
        });
    }); 

    $('#uploadfile').click(function () {
        //uploaded = urn:adsk.objects:os.object:sg1/RPCtest.rvt
        $('#hiddenUploadField').click();

        $('#hiddenUploadField').unbind().change(function () {
            if (this.files.length == 0) return;
            var file = this.files[0];
            var formData = new FormData();
            formData.append('fileToUpload', file);
            var bucketKey = $('#newbucketname').val();
            formData.append('bucketKey', bucketKey);

            $.ajax({
                url: '/api/forge/oss/objects',
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data) {
                    $('#uploadurn').val(data.objectId);
                }, error: function (err) {
                    $('#uploadurn').val(err.responseJSON.ExceptionMessage);
                }
            });
        });
    });


    $('#postJob').click(function () {
        //job = dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2cxL1JQQ3Rlc3QucnZ0
        var objectKey = $('#uploadurn').val();

        jQuery.post({
            url: '/api/forge/modelderivative/jobs',
            contentType: 'application/json',
            data: JSON.stringify({ 'objectKey': objectKey }),
            success: function (res) {
                $("#postjobstatus").val('translation started!');

                $("#base64urn").val(res.base64urn);
            }, error: function (err) {
                $('#postjobstatus').val(err);
            }
        });
    }); 

    $('#getjobsprogress').click(function () {

        var objectKey = $('#base64urn').val();

        jQuery.get({
            url: '/api/forge/modelderivative/status' + '?'+ 'objectKey='+objectKey,
            contentType: 'application/json',
            success: function (res) {
                $("#jobsprogresss").val(res.progress);
            }, error: function (err) {
                $('#jobsprogresss').val(err.responseJSON.ExceptionMessage);
            }
        });
    }); 

    $('#loadviewer').click(function () {
        //var objectKey = $('#base64urn').val();
        //objectKey = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2cxL1JQQ3Rlc3QucnZ0"
        launchViewer(objectKey);
    }); 
});
