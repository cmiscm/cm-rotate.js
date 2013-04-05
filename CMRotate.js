/**
 * @project-site    http://blog.cmiscm.com/?p=3303
 * @repository		https://github.com/cmiscm/cm-rotate.js
 * @author		    Jongmin Kim - cmiscm.com
 * @version 	    1.0
 * @license		    MIT License
 */

var CMRotate = CMRotate || ( function () {

    var _public = {}, $contaier,
        _isTouch = 'ontouchstart' in window, _isTrans3D, _cssTransform,
        PI = Math.PI / 180, _radius, _gap, _ty, _posTotal,
        _itemW, _itemH, _itemHW, _itemHH, _itemCur = 0,
        _posArr = [], _itemArr = [], _bgArr, _bgTotal,
        _centerX, _centerY, _isDispose = false, _fn,
        _isDrag = false, _oldMouseX , _offsetX, _moveX = 0;

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
    function init(div, tw, th, ty, gap, radius, bg, fn) {

        $contaier = document.getElementById(div);

        _cssTransform = getCSSTransform();
        if (!_cssTransform) {
            alert("Your browser does not seem to support CSS Transform.");
            return;
        }
        _isTrans3D = has3d();

        _fn = fn;
        _bgArr = bg;
        _bgTotal = _bgArr.length;
        _itemW = tw;
        _itemH = th;
        _ty = ty;
        _itemHW = _itemW >> 1;
        _itemHH = _itemH >> 1;
        _gap = gap;
        _radius = radius;
        _posTotal = Math.ceil(360 / _gap);

        var i, id, pos, reverse = 0, h_total = _posTotal >> 1;
        for (i = 0; i < _posTotal; i++) {
            pos = ((i * _gap - 90) + 360) % 360;
            _posArr[i] = {pos:pos, item:null, id:i};
        }
        for (i = _posTotal; i > h_total; i--) {
            pos = ((i * _gap - 90) + 360) % 360;
            if (pos > 90 && pos < 270) {
                id = (_bgTotal - 1) - reverse;
                _posArr[i] = {pos:pos, item:null, id:id};
                reverse++;
            }
        }

        // mouse event
        addMouseEvent();

        // resize
        window.onresize = window.onorientationchange = onResize;
        onResize();

        // render
        requestAnimationFrame( animate );
    }


    /**
     * dispose
     */
    function dispose() {
        _isDispose = true;
        if (_isTouch) {
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        } else {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }


    /**
     * click event on each Plane
     */
    function onClick(event) {
        var no = Number((event.currentTarget.id).substr(10, 3)),
            id = _itemArr[no].id;
        _fn(id);
    }


    /**
     * render
     */
    function animate() {
        if (_isDispose) return;
        requestAnimationFrame( animate );

        _moveX = _moveX * 0.9;

        var i, pos = _posArr[0], sita = (pos.pos + (_moveX * 0.1));
        for (i = 0; i < _posTotal; i++) {
            pos = _posArr[i];
            render(pos, sita + (_gap * i), i);
        }
    }

    function render(pos, sita, no) {
        sita = (sita + 360) % 360;
        pos.pos = sita;

        if (sita > 10 && sita < 170) {
            if (pos.item != null) {
                movePlane(pos.item.plane, -5000, -5000, 0);
                pos.item = null;
            }
        } else {
            if (pos.item == null) {
                var id, prev, prev_v, id_v;

                if (sita > 170 && sita < 270) {
                    prev_v = 1;
                    id_v = -1;
                } else {
                    prev_v = -1;
                    id_v = 1;
                }

                prev = _posArr[getInsideMax(no + prev_v, _posTotal)];
                id = getInsideMax(prev.id + id_v, _bgTotal);

                pos.id = id;
                pos.item = getItem(no, id);
            }
            
            setPos(pos.item, sita);
        }
    }


    /**
     * position
     */
    function setPos(item, sita) {
        var imgPos = circlePos(sita),
            value = 270 - sita,
            abs = Math.abs(value),
            zindex = 100 - abs | 0;

        movePlane(item.plane, imgPos.x, imgPos.y, sita + 90);

        item.plane.style.zIndex = zindex;
    }

    function circlePos(sita) {
        var cos = Math.cos(sita * PI),
            sin = Math.sin(sita * PI),
            imgX = (cos) * _radius + _centerX - _itemHW,
            imgY = (sin) * _radius + _centerY - _itemHH;
        return {x:imgX , y:imgY};
    }

    function movePlane(plane, tx, ty, rot) {
        if (_isTrans3D) plane.style[_cssTransform] = 'translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotate(' + rot+ 'deg)';
        else plane.style[_cssTransform] = 'translate(' + tx+ 'px, ' + ty + 'px) rotate(' + rot + 'deg)';
    }


    /**
     * resize event
     */
    function onResize() {
        var sw, sh;
        if (document.documentElement) {
            sw = document.documentElement.clientWidth;
            sh = document.documentElement.clientHeight;
        } else if (document.body.clientWidth) {
            sw = document.body.clientWidth;
            sh = document.body.clientHeight;
        } else {
            sw = window.innerWidth;
            sh = window.innerHeight;
        }
        _centerX = sw >> 1;
        _centerY = sh + _ty;
    }


    /**
     * mouse & touch event
     */
    function addMouseEvent() {
        if (_isTouch) {
            document.addEventListener('touchstart', onTouchStart, false);
            document.addEventListener('touchmove', onTouchMove, false);
            document.addEventListener('touchend', onTouchEnd, false);
        } else {
            document.addEventListener('mousedown', onMouseDown, false);
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);
        }
    }

    function onTouchStart(event) {
        var mx = event.touches[0].pageX;
        onDown(mx);
    }
    function onTouchMove(event) {
        event.preventDefault();
        var mx = event.touches[0].pageX;
        onMove(mx);
    }
    function onTouchEnd(event) {
        onUp();
    }

    function onMouseDown(event) {
        var mx = event.pageX;
        onDown(mx);
    }
    function onMouseMove(event) {
        var mx = event.pageX;
        onMove(mx);
    }
    function onMouseUp(event) {
        onUp();
    }

    function onDown(mx) {
        _isDrag = true;
        _moveX = 0;
        _oldMouseX = _offsetX = mx;
    }
    function onMove(mx) {
        if (!_isDrag) return;
        _moveX = (mx - _oldMouseX);
        _oldMouseX = mx;
    }
    function onUp() {
        _isDrag = false;
    }

    function getInsideMax(no, total) {
        return (no + (total * (Math.abs((no / 10) | 0) + 1))) % total;
    }

    /**
     * get item
     */
    function getItem(no, id) {
        // find plane
        var plane, i, total = _itemArr.length;
        for (i = 0; i < total; i++) {
            plane = _itemArr[i];
            if (plane.use == 0) {
                plane.use = 1;
                plane.no = no;
                plane.id = id;
                return plane;
            }
        }

        // make new plane
        var div = document.createElement("div");
        div.id = 'cm-rotate-' + _itemCur;
        div.style.width = _itemW + 'px';
        div.style.height = _itemH + 'px';
        div.style.position = 'absolute';
        div.style.background = 'url(' + _bgArr[id] + ')';
        movePlane(div, -5000, -5000, 0);
        $contaier.appendChild(div);
        plane = {plane:div, use:1, no:no, id:id};
        _itemArr[_itemCur] = plane;
        _itemCur++;
        div.addEventListener('click', onClick, false);
        return plane;
    }


    /**
     * get css transform
     */
    function getCSSTransform() {
        var properties = [
            'transform',
            'WebkitTransform',
            'msTransform',
            'MozTransform',
            'OTransform'
        ];
        var p;
        while (p = properties.shift()) {
            if (typeof $contaier.style[p] != 'undefined') {
                return p;
            }
        }
        return false;
    }

    /**
     * detect translate3d
     * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
     */
    function has3d() {
        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }


    _public.init = init;
    _public.dispose = dispose;

    return _public;
} )();



if(!window.requestAnimationFrame){
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

