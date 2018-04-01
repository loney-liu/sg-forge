/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict';

var express = require('express');
var app = express();

////For Shotgun data parse
var config = require('./config');
var qs = require('querystring');
var request = require("request");
var http = require("https");
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var token_url="https://jing.shotgunstudio.com/api/v1/auth/access_token";

// prepare server routing
app.use('/', express.static(__dirname + '/../www')); // redirect static calls
app.set('port', process.env.PORT || 3000); // main port

// prepare our API endpoint routing
var oauth = require('./oauthtoken');
var oss = require('./oss');
var modelderivative = require('./modelderivative');
app.use('/', oauth); // redirect oauth API calls
app.use('/', oss); // redirect OSS API calls
app.use('/', modelderivative); // redirect model derivative API calls


//http post from shotgun
app.post('/ami', function(req, res){
    console.log('POST /ami');

	var user_id = req.body.user_id;
	var selected_ids = req.body.selected_ids;
    console.log(selected_ids);

	var sg_data = req.body;
	console.log(JSON.stringify(sg_data));

	var sg_user = config.credentials.shotgun_user;
	var sg_pass = config.credentials.shotgun_pass;

	var body_str = "username={0}&password={1}&grant_type=password".format(sg_user, sg_pass)
	var options = { 
		  method: 'POST',
		  url: token_url,
		  json: true,
		  headers: 
		  { 'Content-Type': 'application/x-www-form-urlencoded',
		     'Accept': 'application/json'},
		  body: body_str
		};

	request(options, function (error, response, body) {
	 	if (error) throw new Error(error);
		console.log(JSON.stringify(body));

		var token_type = body.token_type;
		var access_token = body.access_token
		console.info(token_type);
		console.info(access_token);

	    var ami_full_url="/ami.html?selected_id={0}&token_type={1}&access_token={2}".format(selected_ids, token_type, access_token);
	    res.redirect(ami_full_url);
	 });
});

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

module.exports = app;