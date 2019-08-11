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
colour_lab.prepColourValues = (colour1, colour2) => {
    if (typeof colour1 == "string") {
        colour1 = colour_lab.convertToRgb(colour1);
    }
    if (typeof colour2 == "string") {
        colour2 = colour_lab.convertToRgb(colour2);
    }
    return [colour1, colour2];
}

colour_lab.validateRgb = rgb => {
    if (rgb[0] > 255) {
        throw new Error("Cannot have RGB Value greated than 255 (RED)")
    }
    if (rgb[1] > 255) {
        throw new Error("Cannot have RGB Value greated than 255 (GREEN)")
    }
    if (rgb[2] > 255) {
        throw new Error("Cannot have RGB Value greated than 255 (BLUE)")
    }
}

colour_lab.calculateSteps = (colour1, colour2, steps) => {
    [colour1, colour2] = colour_lab.prepColourValues(colour1, colour2);
    let redStep, greenStep, blueStep;
    colour_lab.validateRgb(colour1);
    colour_lab.validateRgb(colour2);
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
        <div class="colour" style="background-color:rgb(${colours[i][0]},${colours[i][1]},${colours[i][2]})">
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

colour_lab.average_colour = (colour1, colour2) => {
    [colour1, colour2] = colour_lab.prepColourValues(colour1, colour2);
    colour_lab.validateRgb(colour1);
    colour_lab.validateRgb(colour2);
    return [(colour1[0] + colour2[0])/2, (colour1[1] + colour2[1])/2, (colour1[2] + colour2[2])/2];
}

colour_lab.generateCSSGradientRules = (colours, direction="top") => {
    for (let i = 0; i < colours.length; i++) {
        if (typeof colours[i] == "string") {
            colours[i] = colour_lab.convertToRgb(colours[i]);
        }
    }
    let rgbSteps = "";
    for (let i = 1; i < colours.length; i++) {
        rgbSteps += `rgb(${colours[i][0]},${colours[i][1]},${colours[i][2]}) ${i/colours.length * 100}%,`
    }
    let cssString = `
        background: rgb(${colours[0][0]},${colours[0][1]},${colours[0][2]});
        background: -moz-linear-gradient(${direction},  
            rgb(${colours[0][0]},${colours[0][1]},${colours[0][2]}) 0%,
            ${rgbSteps}
            rgb(${colours[colours.length - 1][0]},${colours[colours.length - 1][1]},${colours[colours.length - 1][2]}) 100%); 
        background: -webkit-linear-gradient(${direction},  
            rgb(${colours[0][0]},${colours[0][1]},${colours[0][2]}) 0%,
            ${rgbSteps}
            rgb(${colours[colours.length - 1][0]},${colours[colours.length - 1][1]},${colours[colours.length - 1][2]}) 100%); 
        background: linear-gradient(${(direction == "top") ? "to bottom" : "to bottom"},  
            rgb(${colours[0][0]},${colours[0][1]},${colours[0][2]}) 0%,
            ${rgbSteps}
            rgb(${colours[colours.length - 1][0]},${colours[colours.length - 1][1]},${colours[colours.length - 1][2]}) 100%); 
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='${colour_lab.convertToHex(colours[0])}', endColorstr='${colour_lab.convertToHex(colours[colours.length - 1])}',GradientType=0 ); 
    `;
    return cssString;
}

console.log(colour_lab.generateCSSGradientRules([[255,0,0], [255,192,63],"#FFFF00", [0,255,0], [0,0,255],[170,0,150]]));

exports.default = colour_lab;