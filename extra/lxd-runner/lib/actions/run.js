// Generated by CoffeeScript 2.6.1
module.exports = function({config}) {
  this.call('@nikitajs/lxd-runner/lib/actions/start', config);
  this.call('@nikitajs/lxd-runner/lib/actions/test', config);
  return this.call('@nikitajs/lxd-runner/lib/actions/stop', config);
};