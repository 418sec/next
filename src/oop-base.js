(function(nx, global) {
  var RootClass = function() {};
  var classMeta = {
    __class_id__: 0,
    __type__: 'nx.RootClass',
    __base__: Object,
    __meta__: {},
    __static__: false,
    __statics__: {},
    __properties__: {},
    __methods__: {},
    __method_init__: nx.noop,
    __static_init__: nx.noop
  };

  classMeta.__methods__ = RootClass.prototype = {
    constructor: RootClass,
    init: nx.noop,
    destroy: nx.noop,
    base: function() {
      var caller = this.base.caller;
      var baseMethod;
      if (caller && (baseMethod = caller.__base__)) {
        return baseMethod.apply(this, arguments);
      }
    },
    parent: function(inName) {
      var args = nx.slice(arguments, 1);
      var type = this['@' + inName].__type__
      var base = this.$base;
      switch(type){
        case 'method':
          return base[inName].apply(this, args);
        case 'property':
          var accessor = ['get','set'][args.length]
          return base['@' + inName][accessor].apply(this,args)
      }
    },
    toString: function() {
      return '[Class@' + this.__type__ + ']';
    }
  };

  //mix && export:
  nx.mix(RootClass, classMeta);
  nx.RootClass = RootClass;
})(nx, nx.GLOBAL);
