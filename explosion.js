/*global document, window, setTimeout*/
function Explosion(canvasEl, settings) {

    this.settings = {
        delay: 50,
        delayStep: 1,
        maxSize: 6,
        minSize: 2,
        maxSpeed: 2,
        firstExplosionDegree: 10,
        stepExplosion: 3,
        maxSizeExp: 20,
        maxColor: 255,
        minColor: 100,
        composite: 'lighter',
        channelsR: false,
        channelsG: true,
        channelsB: true
    };

    for (var prop in settings) {
        this.settings[prop] = settings[prop];
    }

    //declare these variable here just for clarity
    this.expImg = null;
    this.now = null;

    this.explosionSize = this.settings.maxSizeExp / 5;
    this.expV = this.settings.stepExplosion;
    this.canvasEl = canvasEl;
    this.ctx = canvasEl.getContext('2d');


    this.expColor = this.getRandomColor();
    this.expImg = this.generateFireBall(64, 64, 1, 255, this.expColor.g, this.expColor.b);
    console.log(this.expColor);



}

/**
 * Explicit freeing of resources. JavaScript normally
 * does this automatically but since there is the possiblity
 * of creating many explosion objects I'm trying to help the garbage collector
 * decide to clean up the explosion instance.
 */
Explosion.prototype.freeResources = function () {
    this.settings = null;
    this.expImg = null;
    this.now = null;
    this.explosionSize = null;
    this.expV = null;
    this.canvasEl = null;
    this.ctx = null;

};

Explosion.prototype.getRandomColor = function () {
    var minColor = this.settings.minColor;
    var obj = {
        r: this.settings.channelsR ? ((Math.random() * (255 - minColor)) | 0) + minColor : 0,
        g: this.settings.channelsG ? ((Math.random() * (255 - minColor)) | 0) + minColor : 0,
        b: this.settings.channelsB ? ((Math.random() * (255 - minColor)) | 0) + minColor : 0
    };

    return obj;

};


Explosion.prototype.generateFireBall = function (w, h, a, r, g, b) {

    r = parseInt(r);
    r = isNaN(r) || r > 255 ? 255 : r;
    g = parseInt(g);
    g = isNaN(g) || g > 255 ? 255 : g;
    b = parseInt(b);
    b = isNaN(b) || b > 255 ? 255 : b;

    var tempCanvas = document.createElement("canvas");

    tempCanvas.width = w;
    tempCanvas.height = h;

    var imgCtx = tempCanvas.getContext("2d");
    var gradient = imgCtx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);

    //TODO fix for implement other colors
    function applyMask(value, mask) {
        value = Math.abs((value * mask / 255) | 0);
        return value < 256 ? value : 255;
    }

    gradient.addColorStop(0, 'rgba(' + [applyMask(r, 255), applyMask(g, 255), applyMask(b, 255), a] + ')');
    //gradient.addColorStop(0, 'rgba(' + [255, 255, 255, a] + ')');
    gradient.addColorStop(0.3, 'rgba(' + [applyMask(r, 254), applyMask(g, 239), applyMask(b, 29), a] + ')');
    //gradient.addColorStop(0.3, 'rgba(' + [255, 255, 0, a] + ')');
    gradient.addColorStop(0.4, 'rgba(' + [applyMask(r, 254), applyMask(g, 88), applyMask(b, 29), a] + ')');
    gradient.addColorStop(0.6, 'rgba(' + [applyMask(r, 239), applyMask(g, 27), applyMask(b, 51), a * 0.05] + ')');
    gradient.addColorStop(0.88, 'rgba(' + [applyMask(r, 153), applyMask(g, 10), applyMask(b, 27), a * 0.05] + ')');
    gradient.addColorStop(0.92, 'rgba(' + [applyMask(r, 254), applyMask(g, 39), applyMask(b, 17), a * 0.1] + ')');
    gradient.addColorStop(0.98, 'rgba(' + [applyMask(r, 254), applyMask(g, 254), applyMask(b, 183), a * 0.2] + ')');
    gradient.addColorStop(1, 'rgba(' + [applyMask(r, 254), applyMask(g, 39), applyMask(b, 17), 0] + ')');

    imgCtx.fillStyle = gradient;
    imgCtx.fillRect(0, 0, w, h);

    return tempCanvas;
};

Explosion.prototype.animate = function () {

    var w = window.innerWidth;
    var h = window.innerHeight;

    var s = this.size * 2;
    var s2 = s / 2;

    this.ctx.save();

    this.ctx.globalCompositeOperation = 'destination-out';
    //ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillStyle = 'rgba(0, 0, 0, .2)';
    //ctx.globalAlpha = .2;
    this.ctx.fillRect(0, 0, w, h);
    //ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = this.settings.composite;
    //ctx.globalCompositeOperation = 'source-over';

    this.ctx.fillStyle = "none";
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();

    this.ctx.stroke();
    this.ctx.restore();

    this.explosionSize += this.expV / this.explosionSize * 10;

    if (this.explosionSize > this.settings.maxSizeExp * 2) {
        this.expV *= -1;
    } else if (this.explosionSize < 0) {
        //remove image
        this.ctx.fillRect(0, 0, w, h);
        this.freeResources();
        return;
    }


    s = this.explosionSize *
        (this.now && this.now-- ? 2 : 1 * ((this.settings.firstExplosionDegree - (this.now || 0))) || 1);

    this.now = this.now || this.settings.firstExplosionDegree;
    s2 = s / 2;

    this.ctx.drawImage(this.expImg, this.x - s2, this.y - s2, s, s);

    var self = this;
    var dostuff = function () {
        window.requestAnimationFrame(self.animate.bind(self));
    };
    var delay = this.settings.delay;
    setTimeout(dostuff, this.settings.delay);
    //this.settings.delay = (delay - this.settings.delayStep) < 0 ? 0 : delay - this.settings.delayStep;
    this.settings.delay = delay + this.settings.delayStep;

};

Explosion.prototype.detonate = function (x, y) {

    var w = window.innerWidth;
    var h = window.innerHeight;


    this.canvasEl.width = w;
    this.canvasEl.height = h;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, w, h);

    var m = this.settings.maxSize > this.settings.minSize ? this.settings.maxSize : this.settings.minSize;
    var mm = m === this.settings.maxSize ? this.settings.minSize : this.settings.maxSize;

    this.size = Math.random() * (m - mm) + mm;

    this.explosionSize = this.settings.maxSizeExp / 5;
    this.expV = this.settings.stepExplosion;
    this.x = x;
    this.y = y;
    this.animate();
};