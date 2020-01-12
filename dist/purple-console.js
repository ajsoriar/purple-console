/**
 * purple-console
 * javascript component that prints logs in a DIV layer. It can be useful when dealing with special hardware like Smart TVs or Set-Top Boxes which do not allow debugging.
 * @version 1.2.5 - 2020-01-12
 * @link https://github.com/ajsoriar/purple-console
 * @author Andres J. Soria R. <ajsoriar@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

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
    var el = null
    var printFunction = null
    var previousPrintAtemptTiemstamp = 0
    var printAtemptTimeBoundary = 500
    var printAtemptBuffer = ''
    var timer = null

    console.log('[ajsrConsole]')

    function init (params) {
      console.log('[ajsrConsole] init!')
      var consoleType = params.mode
      var consoleID = 'ajsrConsole'
      var htmlString = ''

      if (consoleType === 'TEXTAREA') {} else if (consoleType === 'CANVAS') {} else { 
        htmlString = '<div id="' + consoleID + '" style="position: absolute;' +
                    'bottom: 0;' +
                    'left: 0;' +
                    'width: 400px;' +
                    'height: 300px;' +
                    'background-color: #37006b;' +
                    'color: #ff8100;' +
                    'font-family: monospace;' +
                    'font-size: 11px;' +
                    'padding: 3px;' +
                    'z-index: 99999;' +
                    'overflow-x: hidden;' +
                    'overflow-y: auto;' +
                    'border: 1px solid #ef3ffd;">The purple-console is waiting for logs...<br></div>'
      }

      createConsoleEl(htmlString)
      setPrintStrategy(3)
    }

    var createConsoleEl = function (htmlString) {
      var ct = document.createElement('div')
      ct.setAttribute('id', 'ajsrConsole-container')
      ct.innerHTML = htmlString
      document.body.appendChild(ct)
      el = ct.firstChild
    }

    var getTimeString = function () {
      var d = new Date()
      var t = d.toLocaleTimeString()
      return t + ' '
    }

    var log = function (str, color, indentation) {
      var t = getTimeString()
      if (defaults.printTime === true) str = t + ': ' + str

      write(str, color)
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
      printFunction(str)
    }

    var directAttachHTML = function (str) {
      el.innerHTML = printAtemptBuffer + str
    }

    var delayedAttachHtmlByTimestamp = function (str) { 
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

    var refreshScroll = function () {
      el.scrollTop = el.scrollHeight
    }

    var br = function () {
      attachHTML('<br>')
    }

    var filterJSErrors = function () {
      window.onerror = function (message, url, lineNumber) {

        message = 'JS ERROR: In line ' + lineNumber + ': ' + message

        try {
          this.log(message, 'red')
        } catch (error) {

        }

        return false
      }
    }

    var printObj = function (o, borderColor, backgroundColor) {
      if (!borderColor) borderColor = 'gray'
      if (!backgroundColor) backgroundColor = 'transparent'

      var MAX_LEN = defaults.maxObjLength 

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

    var defaultStart = function () {
      init({
        mode: 'HTML'
      })
    }

    if (document.body != null) { 
      defaultStart()
    } else { 
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

    return {
      el: null,
      data: {
        startTime: null,
        laps: null
      },
      init: function (value) {
        init({
          mode: 'HTML'
        })
      },
      log: log,
      cls: function () {
        console.log('[ajsrConsole] cls!')
        el.innerHTML = ''
      },

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

      move: function (str) { 
        var c = el 
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

      moveNext: function () { 
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

      startTime: function () { 
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
        this.setMaxObjLength(100)
        this.fontSize(11)
        this.autoHeight()
        this.autoHeight()
        this.autoHeight()
        this.autoHeight()
      }
    }
  }

  window.ajsrConsole = ajsrConsole()
}())
