var $j = jQuery.noConflict();
function toggleLabel(labelid) {
 $j("#" + labelid).toggle()
}

function checkboxHandler(evt) {
 ch = evt.target
 id = $j(ch).attr("name")
 labelid = "label-" + id.split("-")[1]
 toggleLabel(labelid)
 
}


//function displayProcessingInfo(host, client_id, consent, callback) {

 //$j.getJSON(host + "/user/showConsentInfoAsHumanJSON/" + client_id + "?consentId=" + consent.ID + "&callback=?").done(callback)

//}

function consentChangeHandler(div_id) {
 
 return function(evt) {
 
 var ch = evt.target;
 var id = $j(ch).attr("name").split("-")[1];
 var cwa = $j("#" + div_id + "-added");
 var cwr = $j("#" + div_id + "-removed");
 var sa = cwa.val();
 var sr = cwr.val();
 var arra = sa? sa.split(",") : [];
 var arrr = sr? sr.split(",") : [];
 if (ch.checked) {
  //transition from non checked to checked
  var t = arrr.indexOf(id);
  if (t < 0) {
   arra.push(id);
   cwa.val(arra.join(","));
  
 }
  else {
   arrr.splice(t, 1);
   cwr.val(arrr.join(","));
}
   

 }
 else {
  //transition from checked to non checked
 
  var t = arra.indexOf(id);
  if (t < 0) {
   arrr.push(id);
   cwr.val(arrr.join(","));
   console.log(cwr.val());
 }
  else {
   arra.splice(t, 1);
   cwa.val(arra.join(","));
 }

 }

}
}
/*
function addConsentHandler(evt) {
 var ch = evt.target
 var id = $j(ch).attr("name").split("-")[1]
 var cw =  $j("#consents-added")
 var s = cw.val()
 if (s) {
  var arr = s.split(",")
 }
 else
  {var arr = []}
 var t = arr.indexOf(id)
 if (t < 0) {
  arr.push(id)
 }
 else {
  arr.splice(t, 1)
 }

 
 cw.val(arr.join(","))
 console.log(cw.val())
 

}
function removeConsentHandler(evt) {

 var ch = evt.target
 var id = $j(ch).attr("name").split("-")[1]
 var cw =  $j("#consents-withdrawn")
 var s = cw.val()
 if (s) {
  var arr = s.split(",")
 }
 else
  {var arr = []}
 var t = arr.indexOf(id)
 if (t < 0) {
  arr.push(id)
 }
 else {
  arr.splice(t, 1)
 }
 cw.val(arr.join(","))
 
 
 
}
 */
function displayConsentCheckboxes(prechecked, options) {
 return function (consents) {
 var ul = $j("<ul>");
 var div_id = "consents";
 if (options && options.div_id)
  div_id = options.div_id;
 var div = ('#' + div_id);
 ul.appendTo(div)
 $j.each(consents, function(i, elem) {
  var consent = elem.consent
  //the label for the consent checkbox
  var li = $j("<li>")
  li.appendTo(ul)
 
  var label = $j("<label>").text(consent.descr)
  label.appendTo(li)
  var id = consent.ID
  // the checkbox itself
  var ch = $j("<input>").attr("type", "checkbox").attr("name", "consent-" + id.toString()).attr("id", "consent-" + id.toString());
 
  ch.appendTo(label)
  //the validation mechanism, showing a message while necessary consents are unticekd
  if (prechecked) {
   if (consent.necessary)
    ch.attr("disabled", "disabled");
    //ch.attr("required", "required");
  //if the element has unselected defined then check the box only if unselected is false
    if (!elem.unselected)
     ch.attr("checked", "checked");
    if (consent.withdrawURL && consent.withdrawURL != '')
    $j("<a>").attr("href", consent.withdrawURL).text("Forget me").appendTo(label)

  }
  else if (consent.necessary)
   ch.attr("required", "required");

//removed 8 9 2014
//      else{
//   var va = $j("<label>").attr("id", "label-" + id.toString()).text("Consent is necessary")
//   va.appendTo(label)
//   ch.change(checkboxHandler)
  //attach the tool tip text
//   }
   
 label.attr("title", elem.description); 
// displayProcessingInfo(host, client_id, elem, (function(data){label.attr("title", data)}));
/*
  if (prechecked) {
//  ch.attr("checked", "true")
//  if (elem.necessary) {
//    toggleLabel("label-" + id.toString())
//  }
  ch.bind("change", removeConsentHandler);
 }
 else
  {

   ch.bind("change", addConsentHandler);
  }
*/
ch.bind("change", consentChangeHandler(div_id));
if (options && options.disabled)
 ch.attr("disabled", "disabled");

$j("<br>").appendTo(ul);



});

//if (prechecked) {
  var n = div_id + "-removed";
 
  var rm = $j("<input>").attr("hidden", "true").attr("type", "text").attr("name", n).attr("id", n);
  rm.appendTo(div);

//}
//else {
   var n = div_id + "-added";
   
   var am = $j("<input>").attr("hidden", "true").attr("type", "text").attr("name", n).attr("id", n);
   am.appendTo(div);

//}
   if (options && options.callback)
    options.callback();  
} 
}
function displaySelectedConsents(client_id, consentids, options) {
var host = options.host || "http://privacybuilder.eu";
var url = host + "/user/showSelectedConsentsAsJson/" + client_id + "?consentIds=" + consentids;
if (window.XDomainRequest) {
    // Use Microsoft XDR
    var xdr = new XDomainRequest();
    xdr.open("get", url);
    xdr.onload = function () {
    var JSON = $j.parseJSON(xdr.responseText);
   
    displayConsentCheckboxes(false, options)(JSON);
    };
    xdr.send();
}
else
$j.getJSON(url + "&callback=?").done(displayConsentCheckboxes(false, options));

}

function displayUserConsents(client_id, user_id, options) {
var host = options.host || "http://privacybuilder.eu";
var url = host + "/user/showUserConsentsAsJson/" + client_id + "/" + user_id;
if (window.XDomainRequest) {
    // Use Microsoft XDR
    var xdr = new XDomainRequest();
    xdr.open("get", url);
    xdr.onload = function () {
    var JSON = $j.parseJSON(xdr.responseText);
   
    displayConsentCheckboxes(false, options)(JSON);
    };
    xdr.send();
}
else
$j.getJSON(url + "?callback=?").done(displayConsentCheckboxes(true, options));

}

function displaySelectedUserConsents(client_id, user_id, consentids, options) {
var host = options.host || "http://privacybuilder.eu";
var url = host + "/user/showSelectedUserConsentsAsJson/" + client_id + "/" + user_id + "?consentIds=" + consentids;
if (window.XDomainRequest) {
    // Use Microsoft XDR
    var xdr = new XDomainRequest();
    xdr.open("get", url);
    xdr.onload = function () {
    var JSON = $j.parseJSON(xdr.responseText);
   
    displayConsentCheckboxes(true, options)(JSON);
    };
    xdr.send();
}
else
$j.getJSON(url + "&callback=?").done(displayConsentCheckboxes(true, options));

}

function displaySecurityPolicyItems(client_id){

 return function(security) {
  
  measures = security.measures
  ul = $j("<ul>")
  ul.appendTo("#measures")
  $j.each(measures, function(i, measure) {
   var li = $j("<li>").text(measure)
   li.appendTo(ul)
   })
  advices = security.advices
  ul1 = $j("<ul>")
  ul1.appendTo("#advices")
  $j.each(advices, function(i, advice) {
   var li = $j("<li>").text(advice)
   li.appendTo(ul1)
  })

 }
}
function displaySecurityPolicy(client_id, options) {
var host = options.host || "http://privacybuilder.eu";
var url = host + "/user/showSecurityPolicyAsJson/" + client_id;
if (window.XDomainRequest) {
    // Use Microsoft XDR
    var xdr = new XDomainRequest();
    xdr.open("get", url);
    xdr.onload = function () {
    var JSON = $j.parseJSON(xdr.responseText);
   
    displaySecurityPolicyItems(client_id)(JSON);
    };
    xdr.send();
}
else
$j.getJSON(host + "/user/showSecurityPolicyAsJson/" + client_id + "?callback=?").done(displaySecurityPolicyItems(client_id));

}

function tiecheckboxes(id1, id2) {

 var chk1 = $j("#" + id1);
 var chk2 = $j("#" + id2);
 chk1.bind("change", function(evt) {
  chk2.prop("checked", chk1.prop("checked"));
 });  
  chk2.bind("change", function(evt) {
  chk1.prop("checked", chk2.prop("checked"));
   
});
}
 
  
