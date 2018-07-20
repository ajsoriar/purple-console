(function () {
  console.log("[ajsrConsole] plug-in!");
  var ajsrConsole = function (options, e) {

    'use strict';
    console.log("[ajsrConsole]");
    function init(consoleType) {

      console.log("[ajsrConsole] init!");
      var consoleID = "ajsrConsole";

      if (consoleType === "TEXTAREA") { }
      if (consoleType === "CANVAS") { }
      if (consoleType === "HTML") {
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

      var el = document.createElement('div');
      el.setAttribute("id", "ajsrConsole-container");
      el.innerHTML = htmlString;
      if (document.body != null) {
        document.body.appendChild(el)
      } else {
        console.error("[ajsrConsole] document.body is null!");
      }

    }

    init("HTML");

    return {
      /*
      init: function( value ){
          // canvas console
          // html console
          // textarea console
      },
      */
      el: null,
      data: {
        startTime: null,
        laps:null
      },
      getTimeString: function() {
        var d = new Date();
        var t = d.toLocaleTimeString();
        return t + " "
      },
      log: function (value) {
        var t = this.getTimeString();
        var el = document.getElementById("ajsrConsole-screen");
        el.innerHTML = el.innerHTML + "<br>" + value;
        console.log( t+ "value:", value);
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

  // Ussage example:
  // > ajsrConsole.log("Hello world!")

}());