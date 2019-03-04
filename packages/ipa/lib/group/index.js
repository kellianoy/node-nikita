// Generated by CoffeeScript 2.3.2
// # `nikita.ipa.group`

// Add or modify a group in FreeIPA.

// ## Options

// * `attributes` (object, required)   
//   Attributes associated with the group to add or modify.
// * `referer` (string, ?required)   
//   The HTTP referer of the request, required unless provided inside the `Referer`
//   header.
// * `cn` (string, required)   
//   Name of the group to add.
// * `url` (string, required)    
//   The IPA HTTP endpoint, for example "https://ipa.domain.com/ipa/session/json"

// ## Exemple

// ```js
// require('nikita')
// .ipa.group({
//   cn: 'somegroup',
//   referer: 'https://my.domain.com',
//   url: 'https://ipa.domain.com/ipa/session/json',
//   principal: 'admin@DOMAIN.COM',
//   password: 'XXXXXX'
// }, function(){
//   console.info(err ? err.message : status ?
//     'Group was updated' : 'Group was already set')
// })
// ```
var diff, string;

module.exports = function({options}, callback) {
  var base, base1;
  if (options.attributes == null) {
    options.attributes = {};
  }
  if (options.http_headers == null) {
    options.http_headers = {};
  }
  if ((base = options.http_headers)['Accept'] == null) {
    base['Accept'] = 'applicaton/json';
  }
  if ((base1 = options.http_headers)['Referer'] == null) {
    base1['Referer'] = options.referer;
  }
  if (!options.cn) {
    throw Error(`Required Option: cn is required, got ${options.cn}`);
  }
  if (!options.url) {
    throw Error(`Required Option: url is required, got ${options.url}`);
  }
  if (!options.principal) {
    throw Error(`Required Option: principal is required, got ${options.principal}`);
  }
  if (!options.password) {
    throw Error(`Required Option: password is required, got ${options.password}`);
  }
  if (!options.http_headers['Referer']) {
    throw Error(`Required Option: referer is required, got ${options.http_headers['Referer']}`);
  }
  this.ipa.group.exists(options, {
    cn: options.cn
  });
  this.call(function({}, callback) {
    return this.connection.http(options, {
      negotiate: true,
      url: options.url,
      method: 'POST',
      data: {
        method: !this.status(-1) ? "group_add/1" : "group_mod/1",
        params: [[options.cn], options.attributes],
        id: 0
      },
      http_headers: options.http_headers
    }, function(error, {data}) {
      if (data != null ? data.error : void 0) {
        if (data.error.code === 4202) { // no modifications to be performed
          return callback(null, false);
        }
        error = Error(data.error.message);
        error.code = data.error.code;
      }
      return callback(error, true);
    });
  });
  return this.next(callback);
};

// attributes = {}
// exists = false
// status = false
// @call ({}, callback) ->
//   @ipa.group.show options,
//     cn: options.cn
//     relax: true
//   , (err, {result}) ->
//     return callback err if err and err.code isnt 4001
//     exists = !err
//     attributes = result unless exists
//     callback()
// @call ({}, callback) ->
//   @connection.http options,
//     debug: true
//     negotiate: true
//     url: options.url
//     method: 'POST'
//     data:
//       method: unless exists then "group_add/1" else "group_mod/1"
//       params: [[options.cn], options.attributes]
//       id: 0
//     http_headers: options.http_headers
//   , (error, {data}) ->
//     if data?.error
//       error = Error data.error.message
//       error.code = data.error.code
//     callback error
// @call ({}, callback) ->
//   return callback null, true unless exists
//   @ipa.group.show options,
//     cn: options.cn
//   , (err, {result}) ->
//     return callback err if err
//     keys = diff result, attributes
//     callback null, !!Object.keys(keys).length
// @call ->
//   callback null, status: @status()

// ## Dependencies
string = require('@nikitajs/core/lib/misc/string');

diff = require('object-diff');