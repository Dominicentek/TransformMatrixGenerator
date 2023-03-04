let settings = {
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotationYaw: 0,
    rotationPitch: 0,
    rotationRoll: 0,
    cubeSize: 100
}

let elements = document.getElementsByTagName("input");
for (let i = 0; i < elements.length; i++) {
    if (elements[i].hasAttribute("nosetting")) continue;
    elements[i].onkeyup = function(event) {
        if (isNaN(toNum(event.target.value))) event.target.style.color = "#f00";
        else event.target.style.color = "#fff";
    };
    elements[i].onchange = function(event) {
        let number = toNum(event.target.value);
        if (isNaN(number)) return;
        settings[event.target.getAttribute("varname")] = number;
        document.getElementById("output").value = generate();
    };
    elements[i].value = settings[elements[i].getAttribute("varname")];
}

document.getElementById("output").value = generate();

function copyText(text) {
    navigator.clipboard.writeText(text);
}

function toNum(input) {
    if (input.length === 0 || input === "-") return NaN;
    let number = 0;
    let valid = ".-0123456789".split("");
    let decimal = false;
    let decimalPoint = 0;
    let negative = false;
    for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        if (valid.includes(char)) {
            if (char === ".") {
                if (decimal) return NaN;
                decimal = true;
                continue;
            }
            else if (char === "-") {
                if (i === 0) negative = true;
                else return NaN;
                continue;
            }
            let value = input.charCodeAt(i) - 48;
            if (!decimal) {
                number *= 10;
                number += value;
            }
            else {
                decimalPoint++;
                number += value * Math.pow(10, -decimalPoint);
            }
        }
        else return NaN;
    }
    if (negative) number *= -1;
    return number;
}

function generate() {
    updateCSS();
    let sa = Math.sin(settings.rotationYaw / 180 * Math.PI);
    let sb = Math.sin(settings.rotationPitch / 180 * Math.PI);
    let sc = Math.sin(settings.rotationRoll / 180 * Math.PI);
    let ca = Math.cos(settings.rotationYaw / 180 * Math.PI);
    let cb = Math.cos(settings.rotationPitch / 180 * Math.PI);
    let cc = Math.cos(settings.rotationRoll / 180 * Math.PI);
    let tx = settings.translateX;
    let ty = settings.translateY;
    let tz = settings.translateZ;
    let sx = settings.scaleX;
    let sy = settings.scaleY;
    let sz = settings.scaleZ;
    let matrix = [
        sx * cb * cc,                  sx * cb * sc,                  -sx * sb,     tx,
        sy * (sa * sb * cc - ca * sc), sy * (sa * sb * sc + ca * cc), sy * sa * cb, ty,
        sz * (ca * sb * cc + sa * sc), sz * (ca * sb * sc - sa * cc), sz * ca * cb, tz,
        0,                             0,                             0,            1
    ];
    return "[" + matrix.join(",") + "]";
}

function updateCSS() {
    let style = document.querySelector(":root").style;
    style.setProperty("--translate-x", settings.translateX);
    style.setProperty("--translate-y", -settings.translateY);
    style.setProperty("--translate-z", settings.translateZ);
    style.setProperty("--scale-x", settings.scaleX);
    style.setProperty("--scale-y", settings.scaleY);
    style.setProperty("--scale-z", settings.scaleZ);
    style.setProperty("--rotation-yaw", settings.rotationYaw + "deg");
    style.setProperty("--rotation-pitch", settings.rotationPitch + "deg");
    style.setProperty("--rotation-roll", settings.rotationRoll + "deg");
    style.setProperty("--cube-size", settings.cubeSize + "px");
}

function resetSettings() {
    settings.translateX = 0;
    settings.translateY = 0;
    settings.translateZ = 0;
    settings.scaleX = 1;
    settings.scaleY = 1;
    settings.scaleZ = 1;
    settings.rotationYaw = 0;
    settings.rotationPitch = 0;
    settings.rotationRoll = 0;
    settings.cubeSize = 100;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].hasAttribute("nosetting")) continue;
        elements[i].value = settings[elements[i].getAttribute("varname")];
    }
    document.getElementById("output").value = generate();
}
