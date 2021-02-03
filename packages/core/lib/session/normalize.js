// Generated by CoffeeScript 2.5.1
var normalize, properties,
  indexOf = [].indexOf;

module.exports = normalize = function(action) {
  var property, value;
  if (Array.isArray(action)) {
    return action.map(function(action) {
      return normalize(action);
    });
  }
  if (action.metadata == null) {
    action.metadata = {};
  }
  if (action.config == null) {
    action.config = {};
  }
  if (action.hooks == null) {
    action.hooks = {};
  }
  for (property in action) {
    value = action[property];
    if (indexOf.call(properties, property) >= 0) {
      continue;
    }
    if (/^on_/.test(property)) {
      action.hooks[property] = value;
      delete action[property];
    } else {
      action.config[property] = value;
      delete action[property];
    }
  }
  return action;
};

properties = ['context', 'handler', 'hooks', 'metadata', 'config', 'parent', 'plugins', 'registry', 'run', 'scheduler', 'state'];