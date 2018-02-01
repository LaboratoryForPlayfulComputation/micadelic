(function() {
    if (window.ksRunnerInit) return;

    // This line gets patched up by the cloud
    var pxtConfig = {
    "relprefix": "/tubular/",
    "workerjs": "/tubular/worker.js",
    "tdworkerjs": "/tubular/tdworker.js",
    "monacoworkerjs": "/tubular/monacoworker.js",
    "pxtVersion": "2.0.10",
    "pxtRelId": "",
    "pxtCdnUrl": "/tubular/",
    "commitCdnUrl": "/tubular/",
    "blobCdnUrl": "/tubular/",
    "cdnUrl": "/tubular/",
    "targetVersion": "0.0.0",
    "targetRelId": "",
    "targetUrl": "",
    "simUrl": "/tubular/simulator.html",
    "partsUrl": "/tubular/siminstructions.html",
    "runUrl": "/tubular/run.html",
    "docsUrl": "/tubular/docs.html",
    "isStatic": true
};

    var scripts = [
        "/tubular/highlight.js/highlight.pack.js",
        "/tubular/bluebird.min.js",
        "/tubular/typescript.js",
        "/tubular/semantic.js",
        "/tubular/marked/marked.min.js",
        "/tubular/lzma/lzma_worker-min.js",
        "/tubular/blockly/blockly_compressed.js",
        "/tubular/blockly/blocks_compressed.js",
        "/tubular/blockly/msg/js/en.js",
        "/tubular/pxtlib.js",
        "/tubular/pxtcompiler.js",
        "/tubular/pxtblocks.js",
        "/tubular/pxteditor.js",
        "/tubular/pxtsim.js",
        "/tubular/target.js",
        "/tubular/pxtrunner.js"
    ]

    if (typeof jQuery == "undefined")
        scripts.unshift("/tubular/jquery.js")

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
