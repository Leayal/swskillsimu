/* This is to make jQuery plugin/extended method.
(function ($) {
    $.fn.myfunction = function () {
        alert('hello world');
        return this;
    };
})(jQuery);

$(document).mousemove(function (e) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
});
*/

/* From Modernizr */
var _transitiontype = null;
function whichTransitionEvent() {
    if (_transitiontype)
        return _transitiontype;
    let t,
        el = document.createElement("div");
    let transitions = {
        "transition": "animationend",
        "WebkitTransition": "webkitAnimationEnd"
    }

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            _transitiontype = transitions[t];
        }
    }
    return _transitiontype;
}

function SkillTreeToolTipFramework(target, selector) {
    if (!target)
        throw "Tooltip target can't be null.";
    if (!selector)
        throw "Tooltip selector can't be null.";
    this._selector = selector;
    var myself = this,
        viewportWindow = $(window),
        documentWindow = $(document);

    this.basemouseX = 0;
    this.basemouseY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastRendermouseX = undefined;
    this.lastRendermouseY = undefined;

    this._boundTop = 0;
    this._boundLeft = 0;
    this._boundRight = 0;
    this._boundBottom = 0;

    this.IsListening = false;
    this.isRendering = false;
    this.cancelID;
    this._target = target;
    this._useAnimation = true;
    this.refreshOnClick = true;

    target.addClass("animated");

    // HAHAHA!!! C# maniac again.
    this.OnMouseEnter = new EventHandler();
    this.OnMouseLeave = new EventHandler();
    this.OnTooltipHidden = new EventHandler();

    var lastKnownMouseCapturedElement = null;

    // Currently we don't need this
    // this.OnMouseMove = new EventHandler();

    this.listenFunc = function (event) {
        myself.mouseX = event.clientX;
        myself.mouseY = event.clientY;
    };

    this.mouseClick = function (event) {
        if (myself.refreshOnClick) {
            lastKnownMouseCapturedElement = null;
        }
    };

    this.mouseOn = function (event) {
        if ((event.target === lastKnownMouseCapturedElement) && (myself.isRendering === true))
            return;
        myself.isRendering = true;
        lastKnownMouseCapturedElement = event.target;

        myself.basemouseX = myself.mouseX;
        myself.basemouseY = myself.mouseY;

        myself.OnMouseEnter.Trigger(event);

        myself._target.css({ top: myself.mouseY + "px", left: myself.mouseX + "px" });

        if (event.cancel === true) {
            return;
        }

        myself.UpdateTooltipSize();

        myself.onRender();

        if (myself._useAnimation) {
            // myself._target.stop(false, true).fadeIn("fast");
            if (myself._hidingID)
                clearTimeout(myself._hidingID);
            myself._hidingID = null;
            myself._target.removeClass("fadeout-custom");
            myself._target.addClass("fadein-custom").show();
        } else {
            myself._target.stop(false, true).show();
        }
    };

    this.mouseOff = function (event) {
        myself.isRendering = false;
        if (this.cancelID)
            window.cancelAnimationFrame(myself.cancelID);
        myself.cancelID = null;

        if (myself._useAnimation) {
            // myself._target.stop(false, true).fadeOut("fast");
            myself._target.removeClass("fadein-custom");
            myself._target.addClass("fadeout-custom");
        } else {
            myself._target.stop(false, true).hide();

            something._tooltipHeight = 0;
            something._tooltipWidth = 0;

            something.OnTooltipHidden.Trigger(something._target);
        }

        myself.OnMouseLeave.Trigger(event);
    };

    this.onAnimationCompleted = function (event) {
        if (myself.isRendering === false) {
            myself._target.hide();

            myself._tooltipHeight = 0;
            myself._tooltipWidth = 0;
            myself.lastRendermouseX = undefined;
            myself.lastRendermouseY = undefined;

            myself.OnTooltipHidden.Trigger(myself._target);
        }
    }

    // Prefer to use GPU, so don't use CSS's `Top` and `Left` properties. Use CSS's `transform: TranslateX() translateY()` instead;
    // Although nowadays browsers' CSS engine may use GPU Hardware-Accelerated by default for most of properties.
    this.onRender = function () {
        // request another frame
        if (myself.isRendering === true)
            myself.cancelID = window.requestAnimationFrame(myself.onRender);
        else
            myself.cancelID = null;

        if (myself.lastRendermouseX === myself.mouseX && myself.lastRendermouseY === myself.mouseY)
            return;
        myself.lastRendermouseX = myself.mouseX;
        myself.lastRendermouseY = myself.mouseY;

        let mouseoffsetY = myself.lastRendermouseY + 5,
            allocatedHeight = mouseoffsetY + myself._tooltipHeight,
            viewportHeight = viewportWindow.height(),
            documentHeight = documentWindow.height(),
            viewHeight = Math.min(viewportHeight, documentHeight),
            transformY,

            mouseoffsetX = myself.lastRendermouseX + 5,
            allocatedWidth = mouseoffsetX + myself._tooltipWidth,
            viewportWidth = viewportWindow.width(),
            documentWidth = documentWindow.width(),
            viewWidth = Math.min(viewportWidth, documentWidth),
            transformX;

        let tmpBoundVal = viewHeight - myself._boundBottom;
        if (allocatedHeight > tmpBoundVal) {
            transformY = (tmpBoundVal - myself._tooltipHeight) - myself.basemouseY;
        } else {
            transformY = mouseoffsetY - myself.basemouseY;
        }

        tmpBoundVal = viewWidth - myself._boundRight;
        if (allocatedWidth > tmpBoundVal) {
            transformX = (tmpBoundVal - myself._tooltipWidth) - myself.basemouseX;
        } else {
            transformX = mouseoffsetX - myself.basemouseX;
        }

        // Debug Purpose
        /*
        console.log({
            mouseoffsetY: mouseoffsetY,
            allocatedHeight: allocatedHeight,
            viewportHeight: viewportHeight,
            documentHeight: documentHeight,
            viewHeight: viewHeight,
            transformY: transformY,

            mouseoffsetX: mouseoffsetX,
            allocatedWidth: allocatedWidth,
            viewportWidth: viewportWidth,
            documentWidth: documentWidth,
            viewWidth: viewWidth,
            transformX: transformX
        });
        //*/
        myself._target.css({
            "transform": "translate(" + transformX + "px," + transformY + "px)"
        });

        // myself.OnMouseMove.Trigger();
    }


}

SkillTreeToolTipFramework.prototype.UpdateTooltipSize = function () {
    this._tooltipHeight = this._target.outerHeight(true);
    this._tooltipWidth = this._target.outerWidth(true);
    // Set this to "undefined" to cause invalidate paint
    this.lastRendermouseX = undefined;
    this.lastRendermouseY = undefined;
}

SkillTreeToolTipFramework.prototype.SetBound = function (top, left, right, bottom) {
    if (typeof (top) === "number") {
        this._boundTop = top;
        this._boundLeft = left;
        this._boundRight = right;
        this._boundBottom = bottom;
    } else {
        if (top.hasOwnProperty("top"))
            this._boundTop = top.top;
        else
            this._boundTop = 0;
        if (top.hasOwnProperty("left"))
            this._boundLeft = top.left;
        else
            this._boundLeft = 0;
        if (top.hasOwnProperty("right"))
            this._boundRight = top.right;
        else
            this._boundRight = 0;
        if (top.hasOwnProperty("bottom"))
            this._boundBottom = top.bottom;
        else
            this._boundBottom = 0;
    }
}

SkillTreeToolTipFramework.prototype.StartListen = function () {
    if (this.IsListening === true) return;
    this.IsListening = true;
    $(document.body).on("mouseover", this._selector, this.mouseOn);
    $(document.body).on("mousemove", this._selector, this.listenFunc);
    $(document.body).on("mouseout", this._selector, this.mouseOff);
    $(document.body).on("click", this._selector, this.mouseClick);

    this._target[0].addEventListener(whichTransitionEvent(), this.onAnimationCompleted);
}

SkillTreeToolTipFramework.prototype.StopListen = function () {
    if (this.IsListening === false) return;
    this.IsListening = false;

    $(document.body).off("mouseover", this._selector, this.mouseOn);
    $(document.body).off("mousemove", this._selector, this.listenFunc);
    $(document.body).off("mouseout", this._selector, this.mouseOff);
    $(document.body).off("click", this._selector, this.mouseClick);

    this._target[0].removeEventListener(whichTransitionEvent(), this.onAnimationCompleted);

    this.isRendering = false;
    if (this.cancelID)
        window.cancelAnimationFrame(this.cancelID);
    this.cancelID = null;
}