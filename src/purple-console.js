/**
 * purple-console
 * javascript component that prints logs in a DIV layer. It can be useful when dealing with special hardware like Smart TVs or Set-Top Boxes which do not allow debugging.
 * @version v1.1.0 - 2019-04-14
 * @link https://github.com/ajsoriar/purple-console
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function () {
    console.log("[ajsrConsole] plug-in!");

    var ajsrConsole = function (options, e) {

        'use strict';

        var defaults = {
            opacity: false,
            useColors: false,
            printTime: false,
            bgColor: "#37006b",
            borderColor: "#ef3ffd",
            textColor: "white",
            corner: null
        };

        //var colorModeOn = false; //"NO_COLOR";
        var pixelLog = false;
        var pixelURL = null;
        //var printTime = true;
        var el = null;
        // var screenPositionX = null;

        console.log("[ajsrConsole]");

        function init(params) {

            console.log("[ajsrConsole] init!");
            //var consoleID = "ajsrConsole-" + Date.now();
            var consoleType = params.mode,
                consoleID = "ajsrConsole",
                htmlString = '';

            if (consoleType === "TEXTAREA") {} else if (consoleType === "CANVAS") {} else { //consoleType === "HTML"
                htmlString = '<div id="' + consoleID + '" style="position: absolute;' +
                    'bottom: 0;' +
                    'left: 0;' +
                    'width: 400px;' +
                    'height: 300px;' +
                    'background-color: #37006b;' +
                    'color: #ff8100;' +
                    'font-family: Courier New, Courier, monospace;' +
                    'font-size: 11px;' +
                    'padding: 3px;' +
                    'z-index: 99999;' +
                    'overflow-x: hidden;' +
                    'overflow-y: auto;' +
                    //'border: 1px solid #ef3ffd;"><div id="' + consoleID + '-screen">Waiting for logs...</div></div>';
                    'border: 1px solid #ef3ffd;">The purple console is waiting for logs...<br></div>';
            }

            createConsoleEl(htmlString);
        }

        var createConsoleEl = function (htmlString) {
            var ct = document.createElement('div');
            ct.setAttribute("id", "ajsrConsole-container");
            //ct.setAttribute("style", "position: fixed; top: 0; left: 0;");
            ct.innerHTML = htmlString;
            document.body.appendChild(ct);
            el = ct.firstChild;
        };

        var getTimeString = function () {
            var d = new Date();
            var t = d.toLocaleTimeString();
            return t + " ";
        };

        var defaultStart = function () {
            init({
                mode: "HTML"
            });
        };

        if (document.body != null) { // <script> alocated in <body>

            defaultStart();

        } else { // <script> allocated in <head> will wait for <body> creation to attach the UI

            console.error("[ajsrConsole] document.body is null!");
            console.error("[ajsrConsole] purple-console code was imported in <HEAD>. Let's wait to document creation");

            if (window.onload) {
                var currentOnLoad = window.onload;
                var newOnLoad = function (ev) {
                    currentOnLoad(ev);
                    init(ev);
                    defaultStart();
                };
                window.onload = newOnLoad;
            } else {
                window.onload = defaultStart;
            }

        }

        return {
            el: null,
            data: {
                startTime: null,
                laps: null
            },
            // params:{
            //     opacity: false
            // },
            init: function (value) {
                // canvas console
                // html console
                // textarea console
                init({
                    mode: "HTML"
                });
            },

            /**
                ajsrConsole.log("Hello world!", {color:"red"});
                ajsrConsole.log("Hello world!", {color:"#FF0099"});
            */
            log: function (str, color) {
                var t = getTimeString();
                if (defaults.printTime == true) str = t + ": " + str;
                if (defaults.useColors == true && color != null) {
                    el.innerHTML += '<span style="color:' + color + '">' + str + '</span><br>';
                } else {
                    el.innerHTML += str + "<br>";
                    //el.innerHTML += str + "<br>";
                }
                //var el = document.getElementById("ajsrConsole");
                el.scrollTop = el.scrollHeight;
            },

            // objPrint: function(o){
            //     if (o !== Object(o)) {
            //         this.log('Not an object!', "red");
            //         return;
            //     }
            //     var k=[],p,str;
            //     for (p in o) { if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p); }
            //     str = '<div style="padding:2px 5px;border:1px solid gray">';
            //     for (i=0; i<k.length; i++ ) {
            //         str += JSON.stringify(k[i]) +': <span style="color:yellow">'+ JSON.stringify(o[k[i]]) +"</span><br>";   
            //     }
            //     str += '</div>';
            //     this.log(str);
            // },

            cls: function () {
                console.log("[ajsrConsole] cls!");
                //var el = document.getElementById("ajsrConsole");
                el.innerHTML = "";
            },
            // set max lines,
            // colorlines,
            // autoscroll
            // show timestamp: true
            // autoblock
            // autoblock time: 2000
            // autoblockType: "SPACE" or line
            // set transparent
            // move
            // show line numbers
            // scrollUp num lines
            // scrollDown

            disableAutoBlocks: function () {

            },
            enableAutoBlocks: function (ms) {

            },
            setAutoBlokTime: function (ms) {

            },
            disableAutoScroll: function () {

            },
            enableAutoScroll: function () {

            },
            resetColors: function () {
                this.setBgColor(defaults.bgColor);
                this.setBorderColor(defaults.borderColor);
                this.setTextColor(defaults.textColor);
            },
            setLogAlias: function (str) {
                /* 
                  setLogAlias("debug");
                  debug("Hello world!")
                */
                window[str] = window.ajsrConsole.log;
            },
            setBgColor: function (color) {
                el.style.backgroundColor = color;
            },
            setBorderColor: function (color) {
                el.style.borderColor = color;
            },
            setTextColor: function (color) {
                el.style.color = color;
            },

            // --- POSITION ---

            move: function (str) {
                var c = el; //.style.color = color;
                switch (str) {
                    case "UP":
                        c.style.top = "0";
                        c.style.bottom = "";
                        break;
                    case "DOWN":
                        c.style.top = "";
                        c.style.bottom = "0";
                        break;
                    case "LEFT":
                        c.style.left = "0";
                        c.style.right = "";
                        break;
                    case "RIGHT":
                        c.style.left = "";
                        c.style.right = "0";
                        break;
                }
            },

            moveNext: function () { // Asignado a un boton

                if (defaults.corner === null) defaults.corner = 4;

                if (defaults.corner === 4) {
                    this.move("UP");
                } else if (defaults.corner === 3) {
                    this.move("RIGHT");
                } else if (defaults.corner === 2) {
                    this.move("DOWN");
                } else if (defaults.corner === 1) {
                    this.move("LEFT");
                }

                defaults.corner--;
                if (defaults.corner === 0) defaults.corner = 4;
            },

            // --- SIZE ---

            autoHeight: function () { // Asignado a un boton
                var c = el;
                if (c.style.height == "66%") {
                    c.style.height = "33%";
                } else {
                    c.style.height = "66%";
                }
                console.log("c.style.height:", c.style.height);
            },

            setSize: function (w, h) {
                var c = el;
                c.style.width = w + "px";
                c.style.height = h + "px";
            },

            toggleOpacity: function () {
                if (!defaults.opacity) {
                    el.style.backgroundColor = "rgba(0, 0, 150, 0.5)";
                    defaults.opacity = true;
                } else {
                    el.style.backgroundColor = "rgba(0, 0, 150, 1)";
                    defaults.opacity = false;
                }
            },

            useColors: function (useColors) {
                if (useColors == false) {
                    defaults.useColors = false;
                } else {
                    defaults.useColors = true;
                }
            },

            printTime: function (printTime) {
                if (printTime == false) {
                    defaults.printTime = false;
                } else {
                    defaults.printTime = true;
                }
            },

            setParams: function () {

            },

            startTime: function () { // ajsrConsole.startTime()
                this.data.startTime = Date.now();
                this.log(getTimeString() + "Time stats now!");
                this.data.laps = [{
                    label: "Time starts here!",
                    timestamp: this.data.startTime,
                    elapsed: 0
                }];
            },

            setLap: function (label) {
                if (!label) console.error("Label is mandatory!");
                if (!this.data.startTime) this.startTime();

                var now = Date.now();
                var elapsed = now - this.data.startTime;
                this.log(getTimeString() + label + "; Seconds elapsed: " + elapsed / 1000 + " s.");

                var obj = {
                    label: label,
                    timestamp: now,
                    elapsed: elapsed
                };

                this.data.laps.push(obj);
                return obj;
            },
            printLaps: function () {
                var str = this.data.laps;
                this.log(JSON.stringify(str));
                return str;
            }

        };
    };

    window.ajsrConsole = ajsrConsole();
    window.log = window.ajsrConsole.log;

    // Ussage example:
    // > ajsrConsole.log("Hello world!")

}());


/*
ajsrConsole.setLogAlias("debug");
ajsrConsole.setBgColor("rgba(0,0,150,1)");
ajsrConsole.setBorderColor("rgba(0,255,255,1)");
ajsrConsole.setTextColor("rgba(255,255,255,1)");
ajsrConsole.togleOpacity();

ajsrConsole.printTime();
debug("LOL");
ajsrConsole.printTime(false);

ajsrConsole.move("UP");
ajsrConsole.move("LEFT");
ajsrConsole.move("RIGHT");
ajsrConsole.autoHeight();

ajsrConsole.useColors();
debug("LOL !!!");
debug("LOL color1", "yellow");
ajsrConsole.printTime();
ajsrConsole.useColors(false);

debug("LOL color2", "yellow");
ajsrConsole.togleOpacity();
ajsrConsole.setSize(400,500);
*/