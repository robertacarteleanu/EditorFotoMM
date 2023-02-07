//declarare variabile folosite
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
var new_W;
var new_H;
var x_centru;
var y_centru;
var first = 1;
var copieImg;
var cx_centru;
var cy_centru;
var cnew_W;
var cnew_H;
var image = new Image();
image.src = "";

var newCanvas, newContext;
//preluare imagine din fisier
window.onload = function () {
    var input = document.getElementById('file');
    input.addEventListener('change', handleFiles);
}
function variabileImagine(image) {
    var w = W / image.width;
    var h = H / image.height;
    var prop = Math.min(w, h);
    new_W = image.width * prop;
    new_H = image.height * prop;
    x_centru = (canvas.width - new_W) / 2;
    y_centru = (canvas.height - new_H) / 2;
}
var cprop;
function handleFiles(e) {
    image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    copieImg = new Image();
    copieImg.src = URL.createObjectURL(event.target.files[0]);
    image.crossOrigin = "Anonymous";
    image.onload = () => {
        canvas.style.backgroundImage = "none";
        canvas.style.backgroundColor = "gainsboro";
        variabileImagine(image);
        var w = W / copieImg.width;
        var h = H / copieImg.height;
        cprop = Math.min(w, h);
        cnew_W = copieImg.width * cprop;
        cnew_H = copieImg.height * cprop;
        cx_centru = (canvas.width - cnew_W) / 2;
        cy_centru = (canvas.height - cnew_H) / 2;
        newCanvas = document.createElement('canvas');
        newCanvas.width = cnew_W;
        newCanvas.height = cnew_H;
        newContext = newCanvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height,
            x_centru, y_centru, new_W, new_H);
        selectieTotala();
        var elementX = document.getElementById("adaugaretextxvalues");
        var elementY = document.getElementById("adaugaretextyvalues");
        elementX.innerHTML = "x apartine (" + Math.round(x_centru) + ',' + Math.round(x_centru + new_W - 50) + ')';
        elementY.innerHTML = "y apartine (" + 50 + ',' + Math.round(H) + ')';
        Histograma();
    }
}
//salvare canvas
download = document.getElementById('download');
download.onclick = function (e) {
    let canvasUrl = canvas.toDataURL();
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "download-this-canvas";
    createEl.click();
    createEl.remove();
};
//selectare totala
function selectieTotala2() {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.rect(cx_centru, cy_centru, cnew_W, cnew_H);
    ctx.stroke();
    Histograma();
}

function selectieTotala() {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.rect(x_centru, y_centru, new_W, new_H);
    ctx.stroke();
    Histograma();
}
//selectare mouse up-mouse down
var drawing = false;

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}
let start = {}
canvas.addEventListener("mousedown", (e) => {
    first = 0;
    start = getMousePos(canvas, e);
    if ((start.x > x_centru) && (start.x < (x_centru + new_W)) && (start.y > 0) && (start.y < (H)))
        drawing = true;
});

canvas.addEventListener("mousemove", (e) => {
    if (drawing == false) return;
    ctx.clearRect(0, 0, W, H);
    ctx.setLineDash([5, 15]);
    ctx.drawImage(image, 0, 0, image.width, image.height,
        x_centru, y_centru, new_W, new_H);
    let { x, y } = getMousePos(canvas, e);
    if ((x > x_centru) && (x < (x_centru + new_W)) && (y > 0) && (y < (H)))
        ctx.strokeRect(start.x, start.y, x - start.x, y - start.y);
});
var rectW;
var rectH;
var copieX;
var copieY;

canvas.addEventListener("mouseup", (e) => {
    let { x, y } = getMousePos(canvas, e);

    if ((start.x > x_centru) && (start.x < (x_centru + new_W)) && (start.y > 0) && (start.y < (H)) &&
        (x > x_centru) && (x < (x_centru + new_W)) && (y > 0) && (y < (H))) {
        ctx.setLineDash([]);
        ctx.drawImage(image, 0, 0, image.width, image.height,
            x_centru, y_centru, new_W, new_H);
        rectW = x - start.x;
        rectH = y - start.y;
        ctx.strokeRect(start.x, start.y, rectW, rectH);
        copieX = x;
        copieY = y;
        drawing = false;
        Histograma();
    }

});

function setareCoordonate() {
    if (start.x > copieX) {
        var aux = start.x;
        start.x = copieX;
        copieX = aux;
        rectW = (start.x - copieX) * (-1);
    }
    if (start.y > copieY) {
        var aux = start.y;
        start.y = copieY;
        copieY = aux;
        rectH = (start.y - copieY) * (-1);
    }
}
//pixeli albi din selectie
sterge = document.getElementById("stergereSelectie");
sterge.onclick = () => {

    ctx.drawImage(image, x_centru, y_centru, new_W, new_H);
    if (first == 0) {
        setareCoordonate();
        var pixeli = ctx.getImageData(start.x, start.y, rectW, rectH);
    }
    else
        var pixeli = ctx.getImageData(x_centru, y_centru, new_W, new_H);//pt intreaga imagine
    for (i = 0; i < pixeli.data.length; i += 4) {
        pixeli.data[i + 0] = 256;
        pixeli.data[i + 1] = 256;
        pixeli.data[i + 2] = 256;
    }
    if (first == 0)
        ctx.putImageData(pixeli, start.x, start.y);
    else
        ctx.putImageData(pixeli, x_centru, y_centru);//pt intreaga imagine
    newContext.drawImage(canvas, cx_centru, cy_centru, cnew_W, cnew_H, 0, 0, newCanvas.width, newCanvas.height);
    image.src = newCanvas.toDataURL();
    first = 1;
}
//filtre
function filter(s) {
    let Y;
    ctx.drawImage(image, x_centru, y_centru, new_W, new_H);
    if (first == 0) {
        setareCoordonate();
        var pixeli = ctx.getImageData(start.x, start.y, rectW, rectH);

    }
    else
        var pixeli = ctx.getImageData(x_centru, y_centru, new_W, new_H);
    if (s.includes("albNegru")) {
        for (i = 0; i < pixeli.data.length; i += 4) {
            var avg = (pixeli.data[i + 0] + pixeli.data[i + 1] + pixeli.data[i + 2]) / 3;
            pixeli.data[i + 0] = avg;
            pixeli.data[i + 1] = avg;
            pixeli.data[i + 2] = avg;
        }
    }
    else if (s.includes("sepia")) {
        for (i = 0; i < pixeli.data.length; i += 4) {
            pixeli.data[i + 0] = 0.393 * pixeli.data[i + 0] + 0.769 * pixeli.data[i + 1] + 0.189 * pixeli.data[i + 2];
            pixeli.data[i + 1] = 0.349 * pixeli.data[i + 0] + 0.686 * pixeli.data[i + 1] + 0.168 * pixeli.data[i + 2];
            pixeli.data[i + 2] = 0.272 * pixeli.data[i + 0] + 0.534 * pixeli.data[i + 1] + 0.131 * pixeli.data[i + 2];
        }
    }
    else {
        for (i = 0; i < pixeli.data.length; i += 4) {
            pixeli.data[i + 0] = 255 - pixeli.data[i + 0];
            pixeli.data[i + 1] = 255 - pixeli.data[i + 1];
            pixeli.data[i + 2] = 255 - pixeli.data[i + 2];
        }
    }
    if (first == 0)
        ctx.putImageData(pixeli, start.x, start.y);
    else
        ctx.putImageData(pixeli, x_centru, y_centru);//pt intreaga imagine
    Histograma();
    newContext.drawImage(canvas, cx_centru, cy_centru, cnew_W, cnew_H, 0, 0, newCanvas.width, newCanvas.height);
    first = 1;
    image.src = newCanvas.toDataURL();
    selectieTotala();
}
//+resetare imagine
document.getElementById("btnReset").onclick = () => {
    first = 1;
    let c_w = W / copieImg.width;
    let c_h = H / copieImg.height;
    let c_prop = Math.min(c_w, c_h);
    let c_newW = copieImg.width * c_prop;
    let c_newH = copieImg.height * c_prop;
    let c_centerx = (W - c_newW) / 2;
    let c_centery = (H - c_newH) / 2;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(copieImg, 0, 0, copieImg.width, copieImg.height,
        c_centerx, c_centery, c_newW, c_newH);
    newContext.drawImage(canvas, cx_centru, cy_centru, cnew_W, cnew_H, 0, 0, newCanvas.width, newCanvas.height);
    image.src = newCanvas.toDataURL();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectieTotala();
}
//adaugare text
document.getElementById("btnAdaugaText").onclick = () => {
    let adaugaText = document.getElementById("textAdaugat").value;
    let dimText = document.getElementById("dimText").value;
    let dimVal=document.getElementById("dimText").value;
    let dimensiune = dimVal.value + "px";
    let xText = document.getElementById("pozXText").value;
    let yText = document.getElementById("pozYText").value;
    let culoare = document.getElementById("culoareText").value;

    if (dimText != null && xText != null && yText != null && adaugaText != null) {
        if (dimText > 0 && (xText > x_centru) && (xText < (x_centru + new_W - 50)) && (yText > 50) && (yText < (H))) {
            ctx.drawImage(image, x_centru, y_centru, new_W, new_H);
            ctx.font = dimText+" px" + " Calibri";
            ctx.fillStyle = culoare;
            ctx.fillText(adaugaText, xText, yText);
            newContext.drawImage(canvas, cx_centru, cy_centru, cnew_W, cnew_H, 0, 0, newCanvas.width, newCanvas.height);
            image.src = newCanvas.toDataURL();
            selectieTotala();
        }
    }
}

//histograma
var red, green, blue;
function initializareVectorCulori() {
    red = []; green = []; blue = [];
    for (let i = 0; i < 256; i++) {
        red[i] = 0; green[i] = 0; blue[i] = 0;
    }
}

function Histograma() {
    const histograma = document.getElementById("histograma");
    const context = histograma.getContext("2d");
    context.clearRect(0, 0, histograma.width, histograma.height)
    if (first == 0)
        var pixeli = ctx.getImageData(start.x, start.y, rectW, rectH);
    else
        var pixeli = ctx.getImageData(x_centru, y_centru, new_W, new_H);
    var data = pixeli.data;
    initializareVectorCulori();
    for (let i = 0; i < data.length; i += 4) {
        red[data[i]]++;
        green[data[i + 1]]++;
        blue[data[i + 2]]++;
    }
    var rmax = Math.max.apply(null, red);
    var bmax = Math.max.apply(null, blue);
    var gmax = Math.max.apply(null, green);
    var f = histograma.height / Math.max(rmax, gmax, bmax);
    for (i = 0; i < 256; i++) {
        context.fillStyle = "red";
        context.fillRect(i, histograma.height - f * red[i], 3, 2 * f * red[i]);
        context.fillStyle = "green";
        context.fillRect(i, histograma.height - f * green[i], 3, 2 * f * green[i]);
        context.fillStyle = "blue";
        context.fillRect(i, histograma.height - f * blue[i], 3, 2 * f * blue[i]);
    }
}