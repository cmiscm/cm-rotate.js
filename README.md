cm-rotate.js
============


[![alt text](http://cmiscm.github.com/cm-rotate.js/screenshot/cmrotate-img.jpg)](http://cmiscm.github.com/cm-rotate.js/)


Rotate js using CSS translate3d and transition

 * No dependencies
 * Works in all major browsers that support CSS translate3d or transition (IE9+)
 * Works on tablet PC
 * MIT License
 
### Example
[http://cmiscm.github.com/cm-rotate.js/](http://cmiscm.github.com/cm-rotate.js/)

### Usage

Download the js file and include it in your html.
```html
    <script type="text/javascript" src="CMRotate.js"></script>
```

Add CMRotate.init function in your Javascript code.
```js
    /**
     * Background image Array for each Plane
     */
    var backgroundImages = ["images/img1.jpg", "images/img2.jpg", "images/img3.jpg", ...];

    /**
     * init
     *
     * div - DIV element ID
     * tw - Plane Width
     * th - Plane Height
     * ty - Y position distance from bottom
     * gap - Gap between each Plane
     * radius - Circle Radius
     * bg - Background image Array
     * fn - Mouse click function on each Plane
     */
    CMRotate.init('rotate-div', 200, 300, 100, 12, 600, backgroundImages, clickFn);

    /**
     * Click function
     */
    function clickFn(no) {
        alert('click no - ' + (no + 1));
    }
```



### Dispose

Remove all events and requestAnimationFrame
```js
    CMRotate.dispose();
```

### Questions
If you have any questions, please feel free to ask on [my blog](http://blog.cmiscm.com/?p=3303)


### License
Copyright (c) 2013 Jongmin Kim (http://cmiscm.com) 

Licensed under the MIT license.

 - http://www.opensource.org/licenses/mit-license.php
