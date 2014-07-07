/**
 * 小学一年级电子教案
 * @Author: qiongyue
 * @Date: 2014/06/27
 */

var addEvent = (function () {
    if (document.addEventListener) {
        return function (el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.addEventListener(type, fn, false);
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        };
    } else {
        return function (el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        };
    }
})();

var Junior = {
    pref : {
        answer_selector_item : 'answer-selector-item',
        answer_packet : 'answer-packet',

        group: [
            [1, 4, 7], 
            [3, 6, 8, 9],
            [2, 5]
        ],

        timer : null
    },

    run : function () {
        this.init();
    },

    init : function () {
        this.setDrag();

        $(".answer-selector-item li").removeClass("right");
        $(".answer-selector-item li").css({
            cursor: '-webkit-grab',
            cursor: '-moz-grab'
        });

        //init answer
        $(this.pref.group).each(function (index, item) {
            var temp = "";
            $(item).each(function (cIndex, cItem) {
                temp += String('<img src="images/1a86ex01/{number}.png" />').replace('{number}', cItem);
            });

            temp  = "<div>" + temp + "</div>";

            $(".answer-success .answer-success-item li").eq(index).html(temp);
        });

        $(".answer-area").show();
        $(".answer-success").hide();

        $(".answer-show").hide();

        
        $(".real-restart-btn").unbind("click");
        $(".real-restart-btn").click(function () {
            this.init();
        }.bind(this));

        $(".back_btn").unbind("click");
        $(".back_btn").click(function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }

            if ($(".right").size() == 9) {
                this.show_success();
            } else {
                $(".answer-show").hide();
                $(".answer-area").show();
            }

            $(".back_btn").hide();
        }.bind(this));


        return this;
    },

    setDrag : function () {

        var $this = this;
        $("#" + this.pref.answer_selector_item + " li").each(function (index, item) {
            $(this).attr("draggable", true);
            var id = $this.pref.answer_selector_item.replace(/\-/gi, '_') + "_" + index;
            $(this).attr("id", id);

            addEvent($(this).get(0), "dragstart", function (e) {
                e.dataTransfer.effectAllowed = "copy"; // only dropEffect='copy' will be dropable
                e.dataTransfer.setData('Text', index); // required otherwise doesn't work

                return true;
            });

            addEvent($(this).get(0), "dragend", function (e) {
                //e.dataTransfer.clearData("text");
                
		        return false
            });
           
        });


        $("#" + this.pref.answer_packet + " li").each(function (index) {
            addEvent($(this).get(0), "dragover", function (e) {
                if (e.preventDefault) e.preventDefault(); // allows us to drop
                
                this.className = 'over';
                e.dataTransfer.dropEffect = 'copy';
                return false;
            });


            addEvent($(this).get(0), 'dragenter', function (e) {
                
                this.className = 'over';
                return false;
            });

            addEvent($(this).get(0), 'dragleave', function (e) {
                this.className = '';
             });


            addEvent($(this).get(0), "drop", function (e) {
                if (e.preventDefault) { e.preventDefault(); }
                if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
                
                this.className = '';
                
                var current = parseInt(e.dataTransfer.getData('Text')) + 1;
                if ($.inArray(current, $this.pref.group[index]) !== -1) {
                    $this.show_writing(current);

                    $("#" + $this.pref.answer_selector_item + " li").eq(current-1).attr("draggable", "false");
                    $("#" + $this.pref.answer_selector_item + " li").eq(current-1).css({
                        cursor: 'default'
                    });
                    $("#" + $this.pref.answer_selector_item + " li").eq(current-1).addClass("right");
                } else {
                    //console.log("error");
                }

                return false;
            });
        });

    },

    show_writing : function (number) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        $(".answer-area").hide();

        $(".answer-show .answer-show-box").html(String('<embed src="images/1a86ex01/{number}.svg" width="190" height="190" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" id="svg-box" />').replace("{number}", number));
        
        $(".answer-show").show();
        $(".back_btn").show();

        var $this = this;
        this.timer = setTimeout(function () {
            if ($(".right").size() == 9) {
                $this.show_success();
            } else {
                $(".answer-show").hide();
                $(".answer-area").show();
            }

            $(".back_btn").hide();
        }, 7000);
    },

    show_success : function () {
        if ($(".right").size() < 9) {
            this.run();
            return ;
        }

        $(".answer-show").hide();
        $(".answer-area").hide();

        $(".answer-success").show();
    }
    
};

$(function () {
    $(document).ready(function () {
        Junior.run();
    });
})
