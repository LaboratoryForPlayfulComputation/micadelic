(function() {
    if (window.ksRunnerInit) return;

    // This line gets patched up by the cloud
    var pxtConfig = {
    "relprefix": "/micadelic/",
    "workerjs": "/micadelic/worker.js",
    "tdworkerjs": "/micadelic/tdworker.js",
    "monacoworkerjs": "/micadelic/monacoworker.js",
    "pxtVersion": "2.0.10",
    "pxtRelId": "",
    "pxtCdnUrl": "/micadelic/",
    "commitCdnUrl": "/micadelic/",
    "blobCdnUrl": "/micadelic/",
    "cdnUrl": "/micadelic/",
    "targetVersion": "0.0.0",
    "targetRelId": "",
    "targetUrl": "",
    "simUrl": "/micadelic/simulator.html",
    "partsUrl": "/micadelic/siminstructions.html",
    "runUrl": "/micadelic/run.html",
    "docsUrl": "/micadelic/docs.html",
    "isStatic": true
};

    var scripts = [
        "/micadelic/highlight.js/highlight.pack.js",
        "/micadelic/bluebird.min.js",
        "/micadelic/typescript.js",
        "/micadelic/semantic.js",
        "/micadelic/marked/marked.min.js",
        "/micadelic/lzma/lzma_worker-min.js",
        "/micadelic/blockly/blockly_compressed.js",
        "/micadelic/blockly/blocks_compressed.js",
        "/micadelic/blockly/msg/js/en.js",
        "/micadelic/pxtlib.js",
        "/micadelic/pxtcompiler.js",
        "/micadelic/pxtblocks.js",
        "/micadelic/pxteditor.js",
        "/micadelic/pxtsim.js",
        "/micadelic/target.js",
        "/micadelic/pxtrunner.js"
    ]

    if (typeof jQuery == "undefined")
        scripts.unshift("/micadelic/jquery.js")

    var pxtCallbacks = []

    window.ksRunnerReady = function(f) {
        if (pxtCallbacks == null) f()
        else pxtCallbacks.push(f)
    }

    window.ksRunnerWhenLoaded = function() {
        pxt.docs.requireHighlightJs = function() { return hljs; }
        pxt.setupWebConfig(pxtConfig || window.pxtWebConfig)
        pxt.runner.initCallbacks = pxtCallbacks
        pxtCallbacks.push(function() {
            pxtCallbacks = null
        })
        pxt.runner.init();
    }

    scripts.forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
    })

} ())
