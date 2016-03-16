(function (nx, global) {

  var Path = nx.amd.Path;
  var Loader = nx.amd.Loader;
  var Module = nx.declare('nx.amd.Module', {
    properties: {
      path: '',
      dependencies: null,
      factory: null,
      count: {
        get: function () {
          return this._count;
        },
        set: function (inValue) {
          if (inValue === 0) {
            this.params.reverse();
            this.fire('allLoad');
          }
          this._count = inValue;
        }
      }
    },
    statics: {
      all: {},
      current: null
    },
    methods: {
      init: function (inPath, inDeps, inFactory) {
        this.sets({
          path: inPath || '',
          dependencies: inDeps || [],
          factory: inFactory || nx.noop
        });
        this.count = this.dependencies.length;
        this.params = [];
      },
      load: function (inCallback, inOwner) {
        var ext, path, ownerPath;
        var baseUrl = nx.config.get('baseUrl'),
          deps = this.dependencies;

        this.on('allLoad', function (inParams) {
          this.onModuleAllLoad.call(this, inCallback);
        }, this);

        nx.each(deps, function (_, dep) {
          ownerPath = inOwner ? Path.parent(inOwner.get('path')) : baseUrl;
          ext = Path.getExt(dep);
          path = Path.normalize(
            Path.setExt(ownerPath + dep, ext)
          );
          this.attachLoader(path, ext, inCallback);
        }, this);
      },
      attachLoader: function (inPath, inExt) {
        var loader = new Loader(inPath, inExt);
        loader.on('load', this.onModuleLoad, this);
        loader.load();
      },
      onModuleLoad: function (inLoader) {
        //console.log('item load');
        var currentModule = Module.current,
          factory = inLoader.ext === 'css' ? nx.noop : currentModule.get('factory'),
          deps = inLoader.ext === 'css' ? [] : currentModule.get('dependencies'),
          nDeps = deps.length;
        this.count--;
        this.params[this.count] = factory();
        this.sets({
          path: inLoader.path,
          dependencies: deps,
          factory: factory
        });
        if (nDeps === 0) {
          //this.params.push(factory());
        } else {
          currentModule.load(factory, this);
        }
      },
      onModuleAllLoad: function (inCallback) {
        debugger;
        //console.log('this._callback',this._callback);
        //console.log('this._params',this._params);
        //console.log('inCallback', inCallback);
        //console.log('All loaded!');
        //console.log(inCallback.toString(), inParam);
        var params = this.params.slice(0);
        inCallback.call(this, params);
        this.params = [];
        //console.log(this._params[0]);
        //this._callback(this._params[0]);
        //inCallback.call(this._params.slice(1));
      }
    }
  });

}(nx, nx.GLOBAL));
