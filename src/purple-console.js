(function () {
    console.log("[ajsrConsole] plug-in!");

    var ajsrConsole = function (options, e) {

        'use strict';

        console.log("[ajsrConsole]");
        
        function init( params ) {

          var consoleType = params.mode;

          console.log("[ajsrConsole] init!");
          //var consoleID = "ajsrConsole-" + Date.now();
          var consoleID = "ajsrConsole";

          if (consoleType === "TEXTAREA") { } 
          else if (consoleType === "CANVAS") { }
          else { //consoleType === "HTML"
            var htmlString = '<div id="' + consoleID + '" style="position: absolute;' +
              'bottom: 0;' +
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
              'border: 1px solid #ef3ffd;"><div id="' + consoleID + '-screen">Waiting for logs...</div></div>';
          }

          /*
          position: absolute;
          bottom: 0;
          width: 400px;
          height: 300px;
          background-color: #37006b;
          color: #ff8100;
          font-family: Courier New, Courier, monospace;
          font-size: 11px;
          padding: 3px;
          z-index: 99999;
          overflow-x: hidden;
          overflow-y: auto;
          border: 1px solid #ef3ffd;
          */

         createConsoleEl(htmlString);
      };

      var createConsoleEl  = function(htmlString) {
          var el = document.createElement('div');
          el.setAttribute("id", "ajsrConsole-container");
          el.innerHTML = htmlString;
          document.body.appendChild(el)
      }

      var getTimeString = function() {
          var d = new Date();
          var t = d.toLocaleTimeString();
          return t + " "
      };


      //init("HTML");

      var defaultStart = function(){
        init({ mode:"HTML"});
      }
      
      if (document.body != null) { // <script> alocated in <body>

        defaultStart();
        
      } else { // <script> allocated in <head> will wait for <body> creation to attach the UI

          console.error("[ajsrConsole] document.body is null!");
          console.error("[ajsrConsole] purple-console code was imported in <HEAD>. Let's wait to document creation");

          if(window.onload) {
              var currentOnLoad = window.onload;
              var newOnLoad = function(ev) {
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
            laps:null
          },
          init: function( value ){
              // canvas console
              // html console
              // textarea console
              init({ mode:"HTML"});
          },
          log: function (value, params) {
            var t;
            //if (params) {
              var t = getTimeString();
            //}

            var el = document.getElementById("ajsrConsole-screen");
            el.innerHTML = el.innerHTML + "<br>" + value;
            console.log( t+ "value:", value);
            //
            console.log( t+ "el:", el);
          },
          cls: function () {
            console.log("[ajsrConsole] cls!");
            //console.log("[ajsrConsole] value:", value);
            var el = document.getElementById("ajsrConsole");
            //console.log("[ajsrConsole] el:", el);
            el.innerHTML = "";
          },
          // set max lines,
          // colorlines,
          // autoscroll
          // show timestamp: true

          startTime: function () { // ajsrConsole.startTime()
            this.data.startTime = Date.now();
            this.log( this.getTimeString() +"Time stats now!");
            this.data.laps = [{
              label: "Time starts here!",
              timestamp: this.data.startTime,
              elapsed: 0
            }]
          },
          setLap: function (label) {
            if (!label) console.error("Label is mandatory!");
            if (!this.data.startTime) this.startTime();

            var now = Date.now();
            var elapsed = now - this.data.startTime;
            this.log(this.getTimeString() +label+"; Seconds elapsed: " + elapsed / 1000 + " s.");

            var obj = {
              label: label,
              timestamp: now,
              elapsed: elapsed
            }

            this.data.laps.push( obj );
          }

        }
    }

    window.ajsrConsole = ajsrConsole();
    window.log = window.ajsrConsole.log;

    // Ussage example:
    // > ajsrConsole.log("Hello world!")

}());