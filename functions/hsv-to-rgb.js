// hsv to rgb
// h from 0 to 360; s and v from 0 to 1
// return rgb from -1 to 1

function HSVtoRGB(h, s, v) {
    h = h/360;
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r*2 - 1, g*2 - 1, b*2 - 1];
}

/****
use:

psychoPyRGB = HSVtoRGB(322,1,1)

console.log(psychoPyRGB)

//--> [1 ,-1 ,0.2666666666666657]

****/
