/* ----------------------------------------------------------------------- */
/* ----------------------------------------------------------------------- */
/* ----------------------------------------------------------------------- */
/* ----------------------------------------------------------------------- */

/*
var xhr = null;

var ajsrRequest = function (method, url, params) {

    "use strict";

    console.log("DO");

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {

        if (xhr.readyState === 1) {
            //console.log("xhr.onreadystatechange, 1");
        }

        if (xhr.readyState === 2) {
            //console.log("xhr.onreadystatechange, 2");
        }

        if (xhr.readyState === 3) {
            //console.log("xhr.onreadystatechange, 3");
        }

        if (xhr.readyState === 4) {

            //console.log("xhr.onreadystatechange, 4");

            if ( xhr.status === 200) {
                //console.log("xhr.onreadystatechange, 200");
                ajsrConsole.success("200 OK, XMLHttpRequest to:"+ url);
            } else {
                //console.log("xhr.onreadystatechange, !200");
                ajsrConsole.error("ERROR, XMLHttpRequest to:"+ url);
            }

        }
    };

    var getParams = null;
    var postParams = null;

    if ( method === "GET" ) {
        getParams = params;
        url = url + getParams;
    } else if ( method === "POST"){
        postParams = params;
    }

    xhr.open(method, url, true); // 3rd parameter: async
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // The XMLHttpRequest.withCredentials property is a Boolean that indicates whether or
    // not cross-site Access-Control requests should be made using credentials such as cookies,
    // authorization headers or TLS client certificates. Setting withCredentials has no effect
    // on same-site requests.

    xhr.withCredentials = false; //true; // false gets rid of cors error in some cases

    xhr.send(postParams);
};

function cancelRequest() {
    xhr.abort();
    xhr = null;
}

*/

/* ----------------------------------------------------------------------- */
/* ----------------------------------------------------------------------- */
/* ----------------------------------------------------------------------- */
/* ----------------------------------------------------------------------- */

(function () {
    console.log('[ajsrConsole] plug-in!');

    var ajsrConsole = function (options, e) {
        'use strict';

        var defaults = {
            opacity: false,
            useColors: false,
            autoRemoveOldDivs: null,
            printTime: false,
            bgColor: '#37006b',
            borderColor: '#ef3ffd',
            textColor: 'white',
            corner: null,
            maxObjLength: 5,
            fontSize: 11,
            tools: false,
            version: '@@version-number',
            date: '@@version-date'
        };
        // pixelLog = false,
        // pixelURL = null,
        var el = null;
        var printFunction = null;
        var previousPrintAtemptTiemstamp = 0;
        var printAtemptTimeBoundary = 500;
        var printAtemptBuffer = '';
        var timer = null;

        console.log('[ajsrConsole]');

        function init(params) {
            console.log('[ajsrConsole] init!');
            // var consoleID = "ajsrConsole-" + Date.now();
            var consoleType = params.mode;
            var consoleID = 'ajsrConsole';
            var htmlString = '';

            if (consoleType == 'TEXTAREA') {
            } else if (consoleType === 'CANVAS') {
            } else {
                // consoleType === "HTML"
                htmlString =
                    '' +
                    '<div id="' +
                    consoleID +
                    '" style="position: absolute;' +
                    'bottom: 0;' +
                    'left: 0;' +
                    'width: 400px;' +
                    'height: 300px;' +
                    'background-color: #37006b;' +
                    'color: #ff8100;' +
                    // 'font-family: Courier New, Courier, monospace;' +
                    'font-family: monospace;' +
                    'font-size: 11px;' +
                    'padding: 3px;' +
                    'z-index: 99998;' +
                    'overflow-x: hidden;' +
                    'overflow-y: auto;' +
                    '-moz-box-sizing: border-box;' +
                    '-webkit-box-sizing: border-box;' +
                    'box-sizing: border-box;' +
                    // 'border: 1px solid #ef3ffd;"><div id="' + consoleID + '-screen">Waiting for logs...</div></div>';
                    'border: 1px solid #ef3ffd;">The purple-console v' +
                    defaults.version +
                    ' is waiting for logs...<br>' +
                    //'Version ' + defaults.version + ' - ' + defaults.date + '<br></div>' +
                    //(defaults.tools ? '<div id="ajsrConsole-tools" style="position: fixed;top: 0;left: 0;display: block;z-index: 99999;font-size: 11px;color: white;">' + tools.getToolsHtml() + '</div>' : '');
                    '<div id="ajsrConsole-tools" style="visibility: ' +
                    (defaults.tools === true ? '' : 'hidden') +
                    '; position: fixed;top: 0;left: 0;display: block;z-index: 99999;font-size: 11px;color: white;">' +
                    tools.getToolsHtml() +
                    '</div>';
            }

            createConsoleEl(htmlString);

            // Set default printing strstegy
            setPrintStrategy(3);
        }

        var tools = {};

        tools.canvas = {
            buttonSize: {
                width: 18,
                height: 18
            },
            list: [
                {
                    name: 'up',
                    action: "ajsrConsole.move('UP')",
                    label: '&#8593',
                    position: {
                        x: 1,
                        y: 0
                    }
                },
                {
                    name: 'down',
                    action: "ajsrConsole.move('DOWN')",
                    label: '&#8595',
                    position: {
                        x: 0,
                        y: 0
                    }
                },
                {
                    name: 'left',
                    action: "ajsrConsole.move('LEFT')",
                    label: '&#8592',
                    position: {
                        x: 1,
                        y: 1
                    }
                },
                {
                    name: 'right',
                    action: "ajsrConsole.move('RIGHT')",
                    label: '&#8594',
                    position: {
                        x: 0,
                        y: 1
                    }
                },
                {
                    name: 'cls',
                    action: 'ajsrConsole.cls()',
                    label: 'cls',
                    position: {
                        x: 0,
                        y: 2
                    }
                },
                {
                    name: 'autoheight',
                    action: 'ajsrConsole.autoHeight()',
                    label: 'h',
                    position: {
                        x: 1,
                        y: 2
                    }
                }
            ]
        };

        var createConsoleEl = function (htmlString) {
            var ct = document.createElement('div');
            ct.setAttribute('id', 'ajsrConsole-container');
            // ct.setAttribute("style", "position: fixed; top: 0; left: 0;");
            ct.innerHTML = htmlString;
            document.body.appendChild(ct);
            el = ct.firstChild;
        };

        tools.getToolButton = function (i) {
            var str = '';
            str += '<div onclick="' + tools.canvas.list[i].action + '" style="position: absolute;';
            str += 'right: ' + tools.canvas.list[i].position.x * tools.canvas.buttonSize.width + 'px;';
            str += 'top: ' + tools.canvas.list[i].position.y * tools.canvas.buttonSize.width + 'px;';
            str += 'cursor:pointer;';
            str += 'background-color: rgba(0,0,0,0.4);';
            str += 'background-position:' + i * tools.canvas.buttonSize.width + 'px;';
            str += 'width: ' + tools.canvas.buttonSize.width + 'px;height: ' + tools.canvas.buttonSize.height + 'px; background-image:';
            str += 'box-sizing: border-box;';
            str += '-moz-box-sizing: border-box;';
            str += '-webkit-box-sizing: border-box;';
            str += 'text-align: center;';
            str += 'line-height:' + tools.canvas.buttonSize.height + 'px;';
            str += 'border: 1px solid #004c69;text-shadow: 0 1px 0 black;font-family: sans-serif;font-weight: bold;';
            //str += "url('data:image/gif;base64,R0lGODlhPABCALMAAP39/YGBgZ2dnWtra5OTk/EREXZ2drGxsYuLi6Kcbv7mQV1dXb+1cdnLat/yEoqGbCH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkFFNjI1NDJCQUJGMTFFQjhGRkNGMkQwMjk3ODMxRkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkFFNjI1NDNCQUJGMTFFQjhGRkNGMkQwMjk3ODMxRkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QUU2MjU0MEJBQkYxMUVCOEZGQ0YyRDAyOTc4MzFGRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QUU2MjU0MUJBQkYxMUVCOEZGQ0YyRDAyOTc4MzFGRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAAA8AEIAAAT/cIVJq71USMw7314YaGL5mR4ZFCzKscUEutaxFU5MW7g+D4vgADiYGIDCigoWbCYvSOcCJqMMDICsDXAoDg5ZwJFiqyzC6BnljM7OQAOAJo7gXgPcBRikkmU1TUVQTgJuZkYEABJIXAYBWF1PAWVrcnKCIQOFhW8Ij5wBnmddAQOJWaWeCBqqAWcLmwOts6Gacq+tC54GiYtBjQhRe6GTusSvtgKyxLPJQIq5CJ5xNlh1NrB5e9LFodK4ztLi0uGv3gi65HhabFkIYKiy0jbjuMGbjq0G+N/QqunSDDQxIHBgwQUGxBUbJzBhQH4P5ThE0HCcvHEYM2qkp1HcvokP/0FqBNix5LguJrlpFKnxYkqTHF9mJPBSFk2a+RDc1Kmz4s4uO4PyFEp06FCbPQ8c4EUg6BEAV5rqRNm0qk6pN6sWzbrTlNQ4irgSeJolalOgQbE2DZCWAFutapt6lVsWLoE4eKFWRWu36ke4f/tWnUuAzRCzY4dARcw3MVO3m95ClugX8V2tYOEtxaxXa2O8awstFaB1RCO6hOdqaMNF8hitAj7rNS1ActXake92lkuaNFhl63iRLrWPAGkCXQT0xmsAzGjj0I/TLqVX+eXehseCYeu7uvHYXrsn4x69t/FJl7wr662srIDmANiWwlsE+mjrcUSTZx/d+D4uUFm3Hv9+7r0Tn255aaJcct/9dlgRyrFX24OFBNhghO+5h558YEE1woL7RNghGgpiqBtrJQ6o3HwfBvMhdRBGmJwAMDx42IcYTmjjADAol2KOQE6II4jK9RDkkUca+R6STOZ4X49NNgnlj1EGeV+VWGIYYpZWbskllmrs0I2YJYS5Qx9kemAmDUu0kOYKbq7pAiU9vLlCDlVYEQgRRkSByQg3sCCFJBVE4QQVrljxgAKMMrCAAg140QCjCjwgyCpvUKqpmY9qyugbVijgqAEKJADpFYs2sMCkIFAiQ6NO/KlnEwx8esgjpvryaKQBpBpIBpnWyoCsHAwgrAKgUlSrBKKcWor/qYxaqkoZ/yAr7DK0qGKsqI8yGwqzBuQaTBCnjhvEssTQcwyy2w6bbS3XdhvNLtwuaqqqC9Sq6rLcUPsNssFc25LA8oqTziOLMqqqpglMGq08CxmMLLyiYkuxu+hM/A9DAxl6xEAnkVRRQMJOZEDJHiFkkUwpxdTRySLBnBJJLGdkA00msURRTTWXhFLPPcuD8yNG7dRQUDcXrfRWS+tE2MkMMHVVTwMoENVVVGk1tVh2Fa0WUncxapNWR1CK0F5gXwUXW0WH0jVmmIlt16NV1422YH5FDZjeeF82mNhDPHZE3Wef9TRiJ4sqWQAlV/aY33I12ujjdR9neNxeJc6Azm1jCfuW3YOR7Smk5B3B1HGfWe2W53ANV7Iyqoe+XKOmRFtVKeQZBxR+VjMuqnDfNeX673YvJ2DVVtc26QMNqm4eg75Z7bl5/A0/bPLQmWIdqaoHsHxidccIHntVsy5g8Ob5XmuKCvontvKVhl2387FtGXbFN0b4nY5D1Iq9j1p6n/fiVwpKiW93Phpd8vSXwNGxD0OPgJBbYlRA8dWvSCzYkQUjNB8bTYlLuHOSgpT0JQwpyUslJBKNWJBCE7JQRS28YAybhMIUXmmGR4oAADs=')";
            str += '" on>' + tools.canvas.list[i].label + '</div>';
            return str;
        };

        tools.getToolsHtml = function () {
            if (defaults.tools === false) return;
            var str = '';
            var lon = tools.canvas.list.length;
            for (var i = 0; i < lon; i++) {
                str += tools.getToolButton(i);
            }
            return str;
        };

        tools.refreshPosition = function () {
            if (defaults.tools === false) return;
            var el_container = document.getElementById('ajsrConsole');
            var vo_container = el_container.getBoundingClientRect();
            var el_tools = document.getElementById('ajsrConsole-tools');
            var vo_tools = el_tools.getBoundingClientRect();
            el_tools.style.top = vo_container.y + 'px';
            el_tools.style.left = vo_container.x + vo_container.width + 'px'; //- tools.canvas.buttonSize.width
        };

        //var gerButton
        var getTimeString = function () {
            var d = new Date();
            var t = d.toLocaleTimeString();
            return t + ' ';
        };

        // ----------------------------------------
        //    Core logging functions start here   -
        // ----------------------------------------

        var log = function (str, color, indentation) {
            // include time
            var t = getTimeString();
            if (defaults.printTime === true) str = t + ': ' + str;

            write(str, color);

            // GO Pixel: Rest end point

            /*

                  var pixelHost = "192.168.17.2";
                  var pixepPort = "9000";

                  // var URL = "http://192.168.17.2:9000/ajaxlog";
                  // ajsrRequest( "POST", URL, null );

                  // GO Pixel: Params example
                  var BASE_URL = "http://192.168.17.2:9000";
                  var params = '?timestamp=123'+
                              '&'+ 'type=INFO'+
                              '&'+ 'tag=STB'+
                              '&'+ 'text=Hello World';

                  ajsrRequest( "GET", BASE_URL +"/imglog/log.jpg", params );

                    ajsrServerIpPort("192.168.3.15", "9000");
              */
        };

        var write = function (str, color) {
            if (defaults.useColors === true && color != null) {
                attachHTML('<span style="color:' + color + '">' + str + '</span><br>');
            } else {
                attachHTML(str + '<br>');
            }
        };

        var error = function (str) {
            if (!str) str = 'KO';
            attachHTML('<span style="color:red">' + str + '</span><br>');
        };

        var success = function (str) {
            if (!str) str = 'OK';
            attachHTML('<span style="color:limegreen">' + str + '</span><br>');
        };

        // ----------------------------------
        // - Printing strategies start here -
        // ----------------------------------

        // var previousPrintAtemptTiemstamp = 0;
        // var printAtemptTimeBoundary = 500;
        // var printAtemptBuffer = '';

        // var delayedAttachHTML = function(str) { // This function is Key to stop freezing the UI! many innerHTML operations in a loop end up breaking the user experience.

        //     var currentPrintAtemptTiemstamp = Date.now();
        //     if ( currentPrintAtemptTiemstamp > previousPrintAtemptTiemstamp + printAtemptTimeBoundary ){
        //         el.innerHTML = printAtemptBuffer + str;
        //         printAtemptBuffer = '';
        //         refreshScroll();
        //     } else {
        //         printAtemptBuffer += str;

        //     }
        //     previousPrintAtemptTiemstamp = currentPrintAtemptTiemstamp;
        // };

        var setPrintStrategy = function (num) {
            switch (num) {
                case 1:
                    printFunction = directAttachHTML;
                    success('Printing strategy was set to "direct"');
                    break;
                case 2:
                    printFunction = delayedAttachHtmlByTimestamp;
                    success('Printing strategy was set to "delayed by timestamp"');
                    break;
                case 3:
                    printFunction = attachHtmlByTimeout;
                    success('Printing strategy was set to "delayed by timeout"');
                    break;
                default:
                    error();
            }
        };

        var attachHTML = function (str) {
            // Old aproach: Just do innerHTML ...and the UI gets freezes when debugging in a loop.

            // el.innerHTML += str;
            // refreshScroll();

            // delayedAttachHTML(str); /// This approach is Key to stop freezing the UI! Many innerHTML operations in a loop end up breaking the user experience.
            printFunction(str);
        };

        // --------------
        // A, Not delayed
        // --------------

        // 1. directAttachHTML

        var directAttachHTML = function (str) {
            // Slows the system when doing many innerHtml operations in a loop.
            // I experienced this problem in very slow platforms (Set-top boxes)
            // That is why we go to 2 (delayed printing and timestamp approach)
            el.innerHTML = printAtemptBuffer + str;
        };

        // -----------------------------------
        // B, delayed printing strategies here
        // -----------------------------------

        // 2. delayedAttachHtmlByTimestamp;

        var delayedAttachHtmlByTimestamp = function (str) {
            // On a fast platform sometimes Date.now() is not different from the previous timestamp.
            console.log(' - str:', str);
            var currentPrintAtemptTiemstamp = Date.now();
            if (currentPrintAtemptTiemstamp > previousPrintAtemptTiemstamp + printAtemptTimeBoundary) {
                el.innerHTML = printAtemptBuffer + str;
                printAtemptBuffer = '';
                console.log('... p r i n t !');
                refreshScroll();
            } else {
                printAtemptBuffer += str;
                console.log('s a v e ...');
            }
        };

        // 3. printFunction = attachHtmlByTimeout;

        var attachHtmlByTimeout = function (str) {
            window.clearTimeout(timer);
            printAtemptBuffer += str;
            timer = window.setTimeout(function () {
                delayedAttachHtmlByTimeout(str);
            }, printAtemptTimeBoundary);
        };

        var delayedAttachHtmlByTimeout = function (str) {
            el.innerHTML += printAtemptBuffer;
            printAtemptBuffer = '';
            timer = null;
            refreshScroll();
        };

        // --------------------------------
        // - Printing strategies end here -
        // --------------------------------

        var refreshScroll = function () {
            el.scrollTop = el.scrollHeight;
        };

        var br = function () {
            attachHTML('<br>');
        };

        // ----------------------------------------
        //    Core logging functions end here     -
        // ----------------------------------------

        var filterJSErrors = function () {
            window.onerror = function (message, url, lineNumber) {
                // save error and send to server for example.

                message = 'JS ERROR: In line ' + lineNumber + ': ' + message;

                try {
                    // console.log(message);
                    this.log(message, 'red');
                } catch (error) {}

                // Returning true will prevent the firing of the default handler,
                // and returning false will let the default handler run.
                // return true;

                return false;
            };
        };

        var printObj = function (o, borderColor, backgroundColor) {
            if (!borderColor) borderColor = 'gray';
            if (!backgroundColor) backgroundColor = 'transparent';

            var MAX_LEN = defaults.maxObjLength; // 100; //5; //defaults.maxObjLength;

            if (o !== Object(o)) {
                write('Not an object!', 'red');
                return;
            }
            var k = [];
            var p;
            var str;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
            }

            var lon = k.length;

            if (lon > MAX_LEN) {
                // write('<b>Sorry, this is a big object!</b>');
                write('<b>Sorry, this object has more than ' + MAX_LEN + " properties. </b>Please use 'setMaxObjLength()' to print bigger objets", 'red');
                return;
            }
            str = '<div style="padding:2px 5px;border:1px solid ' + borderColor + '; background-color: ' + backgroundColor + '">';
            for (var i = 0; i < lon; i++) {
                str += JSON.stringify(k[i]) + ': <span style="color:yellow">' + JSON.stringify(o[k[i]]) + '</span><br>';
            }
            str += '</div>';
            write(str);
        };

        var debugObj = function (p_1, p_2, p_3, p_4, p_5) {
            // console.log(typeof( p_1 )); // text
            // console.log(typeof( p_2 )); // json
            // console.log(typeof( p_3 )); // border color
            // console.log(typeof( p_4 )); // bg color
            // console.log(typeof( p_5 )); // bg color

            //if (!borderColor) borderColor = 'gray'
            //if (!backgroundColor) backgroundColor = 'transparent'

            if (typeof p_1 == 'string') {
                if (!p_3) p_3 = 'gray';
                if (!p_5) p_5 = 'white';
                attachHTML('<span style="color: ' + p_5 + '; background-color: ' + p_3 + '; padding: 3px 3px 2px 3px;">' + arguments[0] + '</span><br>');
                printObj(p_2, p_3, p_4);
            } else {
                printObj(p_1, p_2, p_3);
            }
        };

        /*    
            // debugObj({a:"1"})
            // debugObj({a:"1"},1,16)
            // debugObj("Hello", {a:"1"}, 1 , 16)
            // debugObj("Hello",{a:"1"},"red", "black","black");

            debugObj("LOL", myObj,"red","rgba(0,0,0,0.5)");
            debugObj(myObj,"red","rgba(0,0,0,0.5)");
            debugObj(myObj,"red");
            debugObj(myObj);
          */

        var hide = function () {
            document.getElementById('ajsrConsole-container').setAttribute('style', 'display: none');
        };
        var show = function () {
            document.getElementById('ajsrConsole-container').setAttribute('style', 'display: block');
        };

        // -------
        // init
        // -------

        var defaultStart = function () {
            init({
                mode: 'HTML'
            });
        };

        if (document.body != null) {
            // <script> alocated in <body>
            defaultStart();
        } else {
            // <script> allocated in <head> will wait for <body> creation to attach the UI
            console.log('[ajsrConsole] document.body is null!');
            console.log("[ajsrConsole] purple-console code was imported in <HEAD>. Let's wait to document creation");

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

        // -------
        // init
        // -------

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
                    mode: 'HTML'
                });
            },
            log: log,
            cls: function () {
                console.log('[ajsrConsole] cls!');
                // var el = document.getElementById("ajsrConsole");
                el.innerHTML = '';
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
            disableAutoBlocks: function () {},
            enableAutoBlocks: function (ms) {},
            setAutoBlokTime: function (ms) {},
            disableAutoScroll: function () {},
            enableAutoScroll: function () {},
            resetColors: function () {
                this.setBgColor(defaults.bgColor);
                this.setBorderColor(defaults.borderColor);
                this.setTextColor(defaults.textColor);
            },
            setLogAlias: function (str) {
                window[str] = window.ajsrConsole.log;
                window[str].printObj = window.ajsrConsole.printObj;
                window[str].br = window.ajsrConsole.br;
            },
            setConsoleAlias: function (str) {
                window[str] = window.ajsrConsole;
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
            move: function (str) {
                // Changes the position of the console
                var c = el; // .style.color = color;
                switch (str) {
                    case 'UP':
                        c.style.top = '0';
                        c.style.bottom = '';
                        break;
                    case 'DOWN':
                        c.style.top = '';
                        c.style.bottom = '0';
                        break;
                    case 'LEFT':
                        c.style.left = '0';
                        c.style.right = '';
                        break;
                    case 'RIGHT':
                        c.style.left = '';
                        c.style.right = '0';
                        break;
                }
                tools.refreshPosition();
            },
            moveNext: function () {
                // Asignado a un boton
                if (defaults.corner === null) defaults.corner = 4;
                if (defaults.corner === 4) {
                    this.move('UP');
                } else if (defaults.corner === 3) {
                    this.move('RIGHT');
                } else if (defaults.corner === 2) {
                    this.move('DOWN');
                } else if (defaults.corner === 1) {
                    this.move('LEFT');
                }
                defaults.corner--;
                if (defaults.corner === 0) defaults.corner = 4;
            },
            autoHeight: function () {
                var c = el;
                if (c.style.height === '100%') {
                    c.style.height = '33%';
                } else if (c.style.height === '33%') {
                    c.style.height = '66%';
                } else {
                    c.style.height = '100%';
                }
                console.log('c.style.height:', c.style.height);
                refreshScroll();
                tools.refreshPosition();
            },
            setSize: function (w, h) {
                var c = el;
                c.style.width = w + 'px';
                c.style.height = h + 'px';
                tools.refreshPosition();
            },
            toggleOpacity: function () {
                if (!defaults.opacity) {
                    el.style.backgroundColor = 'rgba(0, 0, 150, 0.5)';
                    defaults.opacity = true;
                } else {
                    el.style.backgroundColor = 'rgba(0, 0, 150, 1)';
                    defaults.opacity = false;
                }
            },
            useColors: function (useColors) {
                if (useColors === false) {
                    defaults.useColors = false;
                } else {
                    defaults.useColors = true;
                }
            },
            printTime: function (printTime) {
                if (printTime === false) {
                    defaults.printTime = false;
                } else {
                    defaults.printTime = true;
                }
            },
            setParams: function () {},
            startTime: function () {
                // ajsrConsole.startTime()
                this.data.startTime = Date.now();
                this.log(getTimeString() + 'Time stats now!');
                this.data.laps = [
                    {
                        label: 'Time starts here!',
                        timestamp: this.data.startTime,
                        elapsed: 0
                    }
                ];
            },
            setLap: function (label) {
                if (!label) console.log('Label is mandatory!');
                if (!this.data.startTime) this.startTime();
                var now = Date.now();
                var elapsed = now - this.data.startTime;
                this.log(getTimeString() + label + '; Seconds elapsed: ' + elapsed / 1000 + ' s.');
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
            },
            filterJSErrors: filterJSErrors,
            printObj: printObj,
            obj: printObj,
            debugObj: debugObj,
            write: write,
            error: error,
            success: success,
            setMaxObjLength: function (num) {
                defaults.maxObjLength = num;
                success('maxObjLength was set to ' + num + '!');
            },
            br: br,
            setPrintStrategy: setPrintStrategy,
            hide: hide,
            show: show,
            fontSize: function (num) {
                if (!num) num = defaults.fontSize;
                el.style.fontSize = num + 'px';
            },
            showTools: function () {
                defaults.tools = true;
                tools.refreshPosition();
                document.getElementById('ajsrConsole-tools').style.visibility = '';
            },
            hideTools: function () {
                document.getElementById('ajsrConsole-tools').style.visibility = 'hidden';
            },
            preset: function () {
                this.setLogAlias('debug');
                this.setConsoleAlias('Cnsl');
                this.setBgColor('rgba(0,0,150,1)');
                this.setBorderColor('rgba(0,255,255,1)');
                this.setTextColor('rgba(255,255,255,1)');
                this.move('UP');
                this.move('RIGHT');
                this.useColors();
                this.printTime();
                // this.filterJSErrors();
                this.setMaxObjLength(100);
                this.fontSize(11);
                // this.setSize(700,100);
                this.autoHeight();
                this.autoHeight();
                this.autoHeight();
                this.autoHeight();
            }
        };
    };

    window.ajsrConsole = ajsrConsole();
    // window.log = window.ajsrConsole.log;

    // Ussage example:
    // > ajsrConsole.log("Hello world!");

    window['debugObj'] = window.ajsrConsole.debugObj;
})();

/*
ajsrConsole.filterJSErrors();
//throw new Error("this is not an error");
ajsrConsole.setLogAlias("debug");
ajsrConsole.setBgColor("rgba(0,0,150,1)");
ajsrConsole.setBorderColor("rgba(0,255,255,1)");
ajsrConsole.setTextColor("rgba(255,255,255,1)");
ajsrConsole.toggleOpacity();
ajsrConsole.printTime();
debug("CONSOLE");
ajsrConsole.printTime(false);
ajsrConsole.move("UP");
ajsrConsole.move("LEFT");
ajsrConsole.move("RIGHT");
ajsrConsole.autoHeight();
ajsrConsole.useColors();
debug("CONSOLE !!!");
debug("CONSOLE color1", "yellow");
ajsrConsole.printTime();
ajsrConsole.useColors(false);
debug("CONSOLE color2", "yellow");
ajsrConsole.toggleOpacity();
ajsrConsole.setSize(400,500);
ajsrConsole.useColors();
debug("Start!!", "green");
ajsrConsole.error("ERROR");
ajsrConsole.success("SUCCESS");
//ajsrConsole.useColors(false);

var myObj = {
    "1": "a-11",
    "2": "a-11",
    "3": "a-11",
    "4": "a-11",
    "5": "a-11",
    "6": "a-11"
};

//ajsrConsole.printObj(myObj);

var myObj = {
    "1": "a-11",
    "2": "a-11",
    "3": {
        "b1": "b-11",
        "b2": "b-11",
        "b3": "b-11",
    }
};

debug.printObj(myObj);
*/
