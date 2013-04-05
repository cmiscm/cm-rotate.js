cm-rotate.js
============

Rotate js using CSS translate3d and transition

[Examples](http://work.cmiscm.com/cm-rotate.js/)



Usage
=======

    var backgroundImages = ["images/img1.jpg", "images/img2.jpg", "images/img3.jpg"];

    CMRotate.init('rotate-div', 200, 300, 100, 12, 600, backgroundImages);

Click Event
==============

    /**
     * click event on each Plane
     */
    function onClick(event) {
        var no = Number((event.currentTarget.id).substr(10, 3)),
            id = _itemArr[no].id;
        alert('click no - ' + (id + 1));
    }

