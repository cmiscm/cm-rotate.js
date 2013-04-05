cm-rotate.js
============

Rotate js using CSS translate3d and transition

 * No dependencies
 * Works in Chrome, Safari, Firefox, Opera and IE9, IE10
 * Works on tablet device
 * MIT License
 
[Example](http://work.cmiscm.com/cm-rotate.js/)  -  [Blog](http://blog.cmiscm.com/)



### Usage ###

Download the js file and include it in your html.
```html
    <script type="text/javascript" src="CMRotate.js"></script>
```

```html
    var backgroundImages = ["images/img1.jpg", "images/img2.jpg", "images/img3.jpg"];

    CMRotate.init('rotate-div', 200, 300, 100, 12, 600, backgroundImages);
```


### Click Event ###
```html
    /**
     * click event on each Plane
     */
    function onClick(event) {
        var no = Number((event.currentTarget.id).substr(10, 3)),
            id = _itemArr[no].id;
        alert('click no - ' + (id + 1));
    }
```
