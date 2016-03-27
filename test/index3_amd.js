// ͨ��Ajax���첽����ģ��
function backgroundReadFile(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        if (req.status < 400)
            callback(req.responseText);
    });
    req.send(null);
}


// module.js �Ĳ�������
var defineCache = Object.create(null);
var currentMod = null;
function getModule(name) {
    if (name in defineCache) {
        return defineCache[name];
    }
    var module = {
        exports: null,
        loaded: false,
        onLoad: []
    };
    defineCache[name] = module;
    backgroundReadFile(name, function (code) {
        currentMod = module;
        //eval the loaded code:
        new Function("", code)();
    });
    return module;
}


// module.js �Ĳ�������
function define(depNames, moduleFunction) {
    var myMod = currentMod;
    var deps = depNames.map(getModule);
    deps.forEach(function (mod) {
        if (!mod.loaded) {
            mod.onLoad.push(whenDepsLoaded);
        }
    });
    // ���ڼ���Ƿ����е�����ģ�鶼���ɹ�������
    function whenDepsLoaded() {
        var allLoaded=deps.every(function (m) {
            return m.loaded;
        });
        if (!allLoaded) {
            return;
        }
        var args = deps.map(function (m) {
            return m.exports;
        });
        var exports = moduleFunction.apply(null, args);
        if (myMod) {
            myMod.exports = exports;
            myMod.loaded = true;
            myMod.onLoad.forEach(function (f) {
                f();
            });
        }
    }

    whenDepsLoaded();
}