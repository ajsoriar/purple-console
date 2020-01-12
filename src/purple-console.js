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
  console.log('[ajsrConsole] plug-in!')

  var ajsrConsole = function (options, e) {
    'use strict'

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
      fontSize: 11
    }
    // pixelLog = false,
    // pixelURL = null,
    var el = null
    var printFunction = null
    var previousPrintAtemptTiemstamp = 0;
    var printAtemptTimeBoundary = 500
    var printAtemptBuffer = ''
    var timer = null

    console.log('[ajsrConsole]')

    function init (params) {
      console.log('[ajsrConsole] init!')
      // var consoleID = "ajsrConsole-" + Date.now();
      var consoleType = params.mode
      var consoleID = 'ajsrConsole'
      var htmlString = ''

      if (consoleType == 'TEXTAREA') {} else if (consoleType === 'CANVAS') {} else { // consoleType === "HTML"
        htmlString = '<div id="' + consoleID + '" style="position: absolute;' +
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
                    'z-index: 99999;' +
                    'overflow-x: hidden;' +
                    'overflow-y: auto;' +
                    // 'border: 1px solid #ef3ffd;"><div id="' + consoleID + '-screen">Waiting for logs...</div></div>';
                    'border: 1px solid #ef3ffd;">The purple-console is waiting for logs...<br></div>'
      }

      createConsoleEl(htmlString)

      // Set default printing strstegy
      setPrintStrategy(3)
    }

    var createConsoleEl = function (htmlString) {
      var ct = document.createElement('div')
      ct.setAttribute('id', 'ajsrConsole-container')
      // ct.setAttribute("style", "position: fixed; top: 0; left: 0;");
      ct.innerHTML = htmlString
      document.body.appendChild(ct)
      el = ct.firstChild
    }

    var getTimeString = function () {
      var d = new Date()
      var t = d.toLocaleTimeString()
      return t + ' '
    }

    // ----------------------------------------
    //    Core logging functions start here   -
    // ----------------------------------------

    var log = function (str, color, indentation) {
      // include time
      var t = getTimeString()
      if (defaults.printTime === true) str = t + ': ' + str

      write(str, color)

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

            */
    }

    var write = function (str, color) {
      if (defaults.useColors === true && color != null) {
        attachHTML('<span style="color:' + color + '">' + str + '</span><br>')
      } else {
        attachHTML(str + '<br>')
      }
    }

    var error = function (str) {
      if (!str) str = 'KO'
      attachHTML('<span style="color:red">' + str + '</span><br>')
    }

    var success = function (str) {
      if (!str) str = 'OK'
      attachHTML('<span style="color:limegreen">' + str + '</span><br>')
    }

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
          printFunction = directAttachHTML
          success('Printing strategy was set to "direct"')
          break
        case 2:
          printFunction = delayedAttachHtmlByTimestamp
          success('Printing strategy was set to "delayed by timestamp"')
          break
        case 3:
          printFunction = attachHtmlByTimeout
          success('Printing strategy was set to "delayed by timeout"')
          break
        default:
          error()
      }
    }

    var attachHTML = function (str) {
      // Old aproach: Just do innerHTML ...and the UI gets freezes when debugging in a loop.

      // el.innerHTML += str;
      // refreshScroll();

      // delayedAttachHTML(str); /// This approach is Key to stop freezing the UI! Many innerHTML operations in a loop end up breaking the user experience.
      printFunction(str)
    }

    // --------------
    // A, Not delayed
    // --------------

    // 1. directAttachHTML

    var directAttachHTML = function (str) {
      // Slows the system when doing many innerHtml operations in a loop.
      // I experienced this problem in very slow platforms (Set-top boxes)
      // That is why we go to 2 (delayed printing and timestamp approach)
      el.innerHTML = printAtemptBuffer + str
    }

    // -----------------------------------
    // B, delayed printing strategies here
    // -----------------------------------

    // 2. delayedAttachHtmlByTimestamp;

    var delayedAttachHtmlByTimestamp = function (str) { // On a fast platform sometimes Date.now() is not different from the previous timestamp.
      console.log(' - str:', str)
      var currentPrintAtemptTiemstamp = Date.now()
      if (currentPrintAtemptTiemstamp > previousPrintAtemptTiemstamp + printAtemptTimeBoundary) {
        el.innerHTML = printAtemptBuffer + str
        printAtemptBuffer = ''
        console.log('... p r i n t !')
        refreshScroll()
      } else {
        printAtemptBuffer += str
        console.log('s a v e ...')
      }
    }

    // 3. printFunction = attachHtmlByTimeout;

    var attachHtmlByTimeout = function (str) {
      window.clearTimeout(timer)
      printAtemptBuffer += str
      timer = window.setTimeout(function () {
        delayedAttachHtmlByTimeout(str)
      }, printAtemptTimeBoundary)
    }

    var delayedAttachHtmlByTimeout = function (str) {
      el.innerHTML += printAtemptBuffer
      printAtemptBuffer = ''
      timer = null
      refreshScroll()
    }

    // --------------------------------
    // - Printing strategies end here -
    // --------------------------------

    var refreshScroll = function () {
      el.scrollTop = el.scrollHeight
    }

    var br = function () {
      attachHTML('<br>')
    }

    // ----------------------------------------
    //    Core logging functions end here     -
    // ----------------------------------------

    var filterJSErrors = function () {
      window.onerror = function (message, url, lineNumber) {
        // save error and send to server for example.

        message = 'JS ERROR: In line ' + lineNumber + ': ' + message

        try {
          // console.log(message);
          this.log(message, 'red')
        } catch (error) {

        }

        // Returning true will prevent the firing of the default handler,
        // and returning false will let the default handler run.
        // return true;

        return false
      }
    }

    var printObj = function (o, borderColor, backgroundColor) {
      if (!borderColor) borderColor = 'gray'
      if (!backgroundColor) backgroundColor = 'transparent'

      var MAX_LEN = defaults.maxObjLength // 100; //5; //defaults.maxObjLength;

      if (o !== Object(o)) {
        write('Not an object!', 'red')
        return
      }
      var k = []
      var p; var str
      for (p in o) {
        if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p)
      }

      var lon = k.length

      if (lon > MAX_LEN) {
        // write('<b>Sorry, this is a big object!</b>');
        write('<b>Sorry, this object has more than ' + MAX_LEN + " properties. </b>Please use 'setMaxObjLength()' to print bigger objets", 'red')
        return
      }
      str = '<div style="padding:2px 5px;border:1px solid ' + borderColor + '; background-color: ' + backgroundColor + '">'
      for (var i = 0; i < lon; i++) {
        str += JSON.stringify(k[i]) + ': <span style="color:yellow">' + JSON.stringify(o[k[i]]) + '</span><br>'
      }
      str += '</div>'
      write(str)
    }

    var hide = function () {
      document.getElementById('ajsrConsole-container').setAttribute('style', 'display: none')
    }
    var show = function () {
      document.getElementById('ajsrConsole-container').setAttribute('style', 'display: block')
    }

    // -------
    // init
    // -------

    var defaultStart = function () {
      init({
        mode: 'HTML'
      })
    }

    if (document.body != null) { // <script> alocated in <body>
      defaultStart()
    } else { // <script> allocated in <head> will wait for <body> creation to attach the UI
      console.error('[ajsrConsole] document.body is null!')
      console.error("[ajsrConsole] purple-console code was imported in <HEAD>. Let's wait to document creation")

      if (window.onload) {
        var currentOnLoad = window.onload
        var newOnLoad = function (ev) {
          currentOnLoad(ev)
          init(ev)
          defaultStart()
        }
        window.onload = newOnLoad
      } else {
        window.onload = defaultStart
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
        })
      },
      log: log,
      cls: function () {
        console.log('[ajsrConsole] cls!')
        // var el = document.getElementById("ajsrConsole");
        el.innerHTML = ''
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
        this.setBgColor(defaults.bgColor)
        this.setBorderColor(defaults.borderColor)
        this.setTextColor(defaults.textColor)
      },
      setLogAlias: function (str) {
        window[str] = window.ajsrConsole.log
        window[str].printObj = window.ajsrConsole.printObj
        window[str].br = window.ajsrConsole.br
      },
      setConsoleAlias: function (str) {
        window[str] = window.ajsrConsole
      },
      setBgColor: function (color) {
        el.style.backgroundColor = color
      },
      setBorderColor: function (color) {
        el.style.borderColor = color
      },
      setTextColor: function (color) {
        el.style.color = color
      },

      move: function (str) { // Changes the position of the console
        var c = el // .style.color = color;
        switch (str) {
          case 'UP':
            c.style.top = '0'
            c.style.bottom = ''
            break
          case 'DOWN':
            c.style.top = ''
            c.style.bottom = '0'
            break
          case 'LEFT':
            c.style.left = '0'
            c.style.right = ''
            break
          case 'RIGHT':
            c.style.left = ''
            c.style.right = '0'
            break
        }
      },

      moveNext: function () { // Asignado a un boton
        if (defaults.corner === null) defaults.corner = 4
        if (defaults.corner === 4) {
          this.move('UP')
        } else if (defaults.corner === 3) {
          this.move('RIGHT')
        } else if (defaults.corner === 2) {
          this.move('DOWN')
        } else if (defaults.corner === 1) {
          this.move('LEFT')
        }
        defaults.corner--
        if (defaults.corner === 0) defaults.corner = 4
      },

      autoHeight: function () {
        var c = el
        if (c.style.height === '100%') {
          c.style.height = '33%'
        } else if (c.style.height === '33%') {
          c.style.height = '66%'
        } else {
          c.style.height = '100%'
        }
        console.log('c.style.height:', c.style.height)
        refreshScroll()
      },

      setSize: function (w, h) {
        var c = el
        c.style.width = w + 'px'
        c.style.height = h + 'px'
      },

      toggleOpacity: function () {
        if (!defaults.opacity) {
          el.style.backgroundColor = 'rgba(0, 0, 150, 0.5)'
          defaults.opacity = true
        } else {
          el.style.backgroundColor = 'rgba(0, 0, 150, 1)'
          defaults.opacity = false
        }
      },

      useColors: function (useColors) {
        if (useColors === false) {
          defaults.useColors = false
        } else {
          defaults.useColors = true
        }
      },

      printTime: function (printTime) {
        if (printTime === false) {
          defaults.printTime = false
        } else {
          defaults.printTime = true
        }
      },

      setParams: function () {

      },

      startTime: function () { // ajsrConsole.startTime()
        this.data.startTime = Date.now()
        this.log(getTimeString() + 'Time stats now!')
        this.data.laps = [{
          label: 'Time starts here!',
          timestamp: this.data.startTime,
          elapsed: 0
        }]
      },

      setLap: function (label) {
        if (!label) console.error('Label is mandatory!')
        if (!this.data.startTime) this.startTime()

        var now = Date.now()
        var elapsed = now - this.data.startTime
        this.log(getTimeString() + label + '; Seconds elapsed: ' + elapsed / 1000 + ' s.')

        var obj = {
          label: label,
          timestamp: now,
          elapsed: elapsed
        }

        this.data.laps.push(obj)
        return obj
      },

      printLaps: function () {
        var str = this.data.laps
        this.log(JSON.stringify(str))
        return str
      },

      filterJSErrors: filterJSErrors,
      printObj: printObj,
      obj: printObj,
      write: write,
      error: error,
      success: success,
      setMaxObjLength: function (num) {
        defaults.maxObjLength = num
        success('maxObjLength was set to ' + num + '!')
      },
      br: br,
      setPrintStrategy: setPrintStrategy,
      hide: hide,
      show: show,
      fontSize: function (num) {
        if (!num) num = defaults.fontSize
        el.style.fontSize = num + 'px'
      },
      preset: function () {
        this.setLogAlias('debug')
        this.setConsoleAlias('Cnsl')
        this.setBgColor('rgba(0,0,150,1)')
        this.setBorderColor('rgba(0,255,255,1)')
        this.setTextColor('rgba(255,255,255,1)')
        this.move('UP')
        this.move('RIGHT')
        this.useColors()
        this.printTime()
        // this.filterJSErrors();
        this.setMaxObjLength(100)
        this.fontSize(11)
        // this.setSize(700,100);
        this.autoHeight()
        this.autoHeight()
        this.autoHeight()
        this.autoHeight()
      }
    }
  }

  window.ajsrConsole = ajsrConsole()
  // window.log = window.ajsrConsole.log;

  // Ussage example:
  // > ajsrConsole.log("Hello world!");
}())

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
