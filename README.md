# purple-console  [![Build Status](https://travis-ci.org/ajsoriar/angular-avatar.svg?branch=master)](https://travis-ci.org/ajsoriar/angular-avatar)

[![npm version](https://badge.fury.io/js/purple-console.svg)](https://badge.fury.io/js/purple-console)
[![NuGet version](https://badge.fury.io/nu/purple-console.svg)](https://badge.fury.io/nu/purple-console)

[![NPM](https://nodei.co/npm/purple-console.png?downloads=true&stars=true)](https://nodei.co/npm/purple-console/)

Javascript component that prints logs in a DIV layer. It can be useful when dealing with special hardware like Smart TVs or Set-Top Boxes that don't allow debugging.

![purple-console initialization example](./demo/purple-console_example-1.gif?raw=true "purple-console initialization example")

Live example: <http://subidote.com/purple-console/>

## 1 Quick start

### 1.1 Download and Install purple-console

- Yarn: **yarn add purple-console**
- NPM: **npm install purple-console**
- github: **<https://github.com/ajsoriar/purple-console>**

## 2 Include dependences

```bash
yarn add purple-console
# or
npm install purple-console
```

### 2.1 In your HTML

```javascript
<script src="./node_modules/purple-console/src/purple-console.js"></script>
```

### 2.2 In your js code

```javascript
<script>
    ajsrConsole.log("Hello world!");
</script>
```

### 2.3 Extra examples ready to copy and paste

```javascript
<script>
    ajsrConsole.filterJSErrors();
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
    debug("CONSOLE color1", "yellow");
    ajsrConsole.printTime();
    ajsrConsole.useColors(false);
    debug("CONSOLE color2", "yellow");
    ajsrConsole.toggleOpacity();
    ajsrConsole.setSize(400,500);
    ajsrConsole.error("ERROR");
    ajsrConsole.success("SUCCESS");
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
</script>
```

![purple-console print example](./demo/purple-console_example-blue.gif?raw=true "purple-console print example")

## 3 Core functions

### 3.1 Printing on a div layer

By default all printing stuff will be done using one color

### 3.1 Printing text in color

```javascript
ajsrConsole.usecolors();
ajsrConsole.debug("Message in color!", "yellow");
```

#### Some notes about colors

This console creates a div layer on every log operation when color mode is on. In some devices rendering more than 100 divs increases the response of the UI more and more til it becomes unmanageable. So you should reset the console from time to time.

```javascript
ajsrConsole.cls(); //clear the console from time to time
```

<!-- 2 autoremove: true This removes log lines out of scope. -->

Completely deactivate color

```javascript
ajsrConsole.usecolors(false);
```

### 3.2 Change background color

```javascript
ajsrConsole.setBgColor("rgba(0,0,150,1)");
```

### 3.3 Print JSON object

```javascript
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
```

![purple-console print js Object example](./demo/purple-console_print-object.gif?raw=true "purple-console print js Object example")

### 3.4 Set start points and LAPs

Used to do benchmarking and print the results in the console.

```javascript
ajsrConsole.setLap("LAP TEXT!");
```

## 4 Complete list of available options

| Methods              | Default | Description           |
| :------------------- | :----- | :--------------------- |
| `init`                 | - | Resets the console to initila params.           |
| `log`                  | - | Main functionality here.           |
| `cls`                  | - | Clear the console.           |
| `resetColors`          | - | Go back to default colors.           |
| `setLogAlias`          | - | Use *whatever* instead of `ajsrConsole`.         |
| `setBgColor`           | - | Color of the background.           |
| `setBorderColor`       | - | Color of the border.           |
| `setTextColor`         | - | -           |
| `move`                 | DOWN & LEFT | -           |
| `moveNext`             | - | -           |
| `autoHeight`           | - | Will toggle height from 33% and 66% of the available space.           |
| `setSize`              | number | -           |      |
| `toggleOpacity`        | - | Toggles opacity between 100% to 50%.         |
| `useColors`            | false | Allows the use of colors when doing `log`           |
| `printTime`            | false | -           |
| `setParams`            | - | -           |
| `startTime`            | - | -           |
| `setLap`               | - | -           |
| `printLaps`            | - | -           |
| `filterJSErrors`       | false | -           |
| `printObj`     | - | Prints a json object in a box. 1st param is a json. 2nd and 3rd (optional) are border and background colors. |
| `write`                | - | -           |
| `error`                | - | -           |
| `success`               | - | -           |
| `setMaxObjLength`      | 5 | Increases the allowed print length.          |
| `br`                   | - | Prints a blank line.           |
| `setPrintStrategy`     | timeout | 1, 2 delayed by timestamp or 3 delayed by timeout          |
| `hide`     | - | Hides the console.           |
| `show`     | - | Shows the console.          |
| `fontSize`     | 11 | Sets the font size.          |
| `preset`     | - | Sets a group of configuration options useful in my day by day work.        |

## 5 Development

### 5.1 Install node

<https://nodejs.org/es/>

### 5.2 Install grunt globally

```bash
sudo npm install --unsafe-perm=true --allow-root
sudo npm install -g grunt-cli
```

### 5.3 Build

```bash
grunt build
```

## 6 License

purple-console is [MIT licensed](./LICENSE).

**Free Software, Yeah!**
