let colour_lab = {};
const fs = require('fs');

colour_lab.convertToRgb = (hex) => {
    if (/^[#]*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex) == false) {
        throw new Error("Invalid Hex Code");
    }
    if (hex.indexOf("#") != -1) {
        hex = hex.slice(1, hex.length);
    }
    hex = hex.split("");
    let red, green, blue;
    if (hex.length == 6) {
        red = hex[0] + hex[1];
        green = hex[2] + hex[3];
        blue = hex[4] + hex[5];
    } else {
        red = hex[0] + hex[0];
        green = hex[1] + hex[1];
        blue = hex[2] + hex[2];
    }
    red = parseInt(red, 16)
    green = parseInt(green, 16)
    blue = parseInt(blue, 16)
    return [red, green, blue];
}

colour_lab.convertToHex = (rgb) => {
    return "#" + parseInt(rgb[0]).toString(16) + parseInt(rgb[1]).toString(16) + parseInt(rgb[2]).toString(16);
}

colour_lab.calculateSteps = (colour1, colour2, steps) => {
    if (typeof colour1 == "string") {
        colour1 = colour_lab.convertToRgb(colour1);
    }
    if (typeof colour2 == "string") {
        colour2 = colour_lab.convertToRgb(colour2);
    }
    let redStep, greenStep, blueStep;
    redStep = (colour2[0] - colour1[0]) / steps;
    greenStep = (colour2[1] - colour1[1]) / steps;
    blueStep = (colour2[2] - colour1[2]) / steps;
    let stepColours = [];
    for (let i = 0; i < steps; i++) {
        stepColours.push([colour1[0] + (redStep * (i)), colour1[1] + (greenStep * (i)), colour1[2] + (blueStep * (i))]);
    }
    return [...stepColours, colour2];
}

colour_lab.generateHTML = (steps) => {
    for (let i = 0; i < steps.length; i++) {
        markup += `
        <div class="colour" style="background-color:rgb(${steps[i][0]},${steps[i][1]},${steps[i][2]})">
        </div>
        `;
    }
    markup = `
    <style>
        body {
            margin:0; 
            padding:0;
        }
        .colour {
            min-width:70px; 
            height:70px; 
            flex-basis: auto; 
            flex-grow: 1;
        }
        .container {
            display:flex;
            flex-direction:row; 
            flex-wrap:wrap;
        }
    </style>
    <div class="container">
        ${markup}
    </div>
    `;


    fs.writeFile('output.html', markup, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("DONE!");
        }
    })
}