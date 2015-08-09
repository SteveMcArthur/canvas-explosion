var canvas_utils;

!function() {
    canvas_utils = {
        resources : {
            images : {
                particle : (function() {
                    particleImg = new Image();
                    // © https://github.com/rictic/code_swarm/blob/master/src/particle.png
                    particleImg.src = "data:image/png;base64,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";
                    return particleImg;
                })()
                , particleII : (function() {
                    particleImg = new Image();
                    particleImg.src = "data:image/png;base64,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";
                    return particleImg;
                })()
            }
        }
        , generateNeonBall : generateNeonBall
        , colorize : colorize
    }
    
    /**
     * Generate a neon ball
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} r red
     * @param {Number} g green
     * @param {Number} b blue
     * @param {Number} a alpha
     * @returns {HTMLCanvasElement}
     */
    function generateNeonBall(w, h, r, g, b, a) {
    
        var tempCanvas = document.createElement("canvas");
    
        tempCanvas.width = w;
        tempCanvas.height = h;
    
        var imgCtx = tempCanvas.getContext("2d");
        var gradient = imgCtx.createRadialGradient( w/2, h/2, 0, w/2, h/2, w/2 );
    
        gradient.addColorStop( 0, 'rgba(255,255,255,' + a + ')' );
        gradient.addColorStop( 0.3, 'rgba(' + [r, g, b, a * .5] + ')' );
        gradient.addColorStop( 1, 'rgba(' + [r, g, b, 0] + ')' ); //0,0,64
    
        imgCtx.fillStyle = gradient;
        imgCtx.fillRect( 0, 0, w, h);
    
        return tempCanvas;
    }
    
    /**
     * Colorize a image
     * @param {Image} img - origin image
     * @param {Number} r - red
     * @param {Number} g - green
     * @param {Number} b - blue
     * @param {Number} a - alpha
     * @returns {HTMLCanvasElement}
     */
    function colorize(img, r, g, b, a) {
    
        var tempCanvas = document.createElement("canvas");
    
        if (!img || !img.width)
            return tempCanvas;
    
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
    
        var imgCtx = tempCanvas.getContext("2d"),
            imgData, i;
        imgCtx.drawImage(img, 0, 0);
    
        imgData = imgCtx.getImageData(0, 0, img.width, img.height);
    
        i = imgData.data.length;
        while((i -= 4) > -1) {
            imgData.data[i + 3] = imgData.data[i] * a;
            if (imgData.data[i + 3]) {
                imgData.data[i] = r;
                imgData.data[i + 1] = g;
                imgData.data[i + 2] = b;
            }
        }
    
        imgCtx.putImageData(imgData, 0, 0);
    
        return tempCanvas;
    }
}();

/**
 * rAF & cAF
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback/*, element*/) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();