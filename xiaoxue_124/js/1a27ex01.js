/**
 * 小学算术
 * @Author: qiongyue
 * @Date: 2014/06/28
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

var Algorithm = {
    pref : {
    
    },

    step: 1,
    fruit : null,
    type : null,
    new : false,
    
    run: function () {
        this.init();
    },

    init : function () {
        this.step = 1;
        this.fruit = null;

        $(".select-type-box").hide();
        $(".answer-box").hide();
        $(".select-fruit-box").show();
        $(".fruit-list-item li").removeClass("focus");
        $(".clear-btn").hide();
        $(".real-restart-btn").hide();
        this.clear();

        var $this = this;
        $(".fruit-list-item li").unbind("click");
        $(".fruit-list-item li").click(function () {
            $(this).toggleClass("focus").siblings().removeClass("focus");
            
            if ($(this).hasClass("focus")) {
                $this.fruit = $(this).index() + 1;
            } else if ($this.fruit == ($(this).index()+1)) {
                $this.fruit = null;
            }
        });
        
        $(".select-type-item li").unbind("click");
        $(".select-type-item li").click(function () {
             $(this).toggleClass("focus").siblings().removeClass("focus");

            if ($(this).hasClass("focus")) {
                $this.type = $(this).index()+1;
            } else if ($this.type == ($(this).index()+1)) {
                $this.type = null;
            }
        });

       
        $(".confirm-btn").unbind("click");
        $(".confirm-btn").click(function () {
            if (this.step == 1) {
                if (this.fruit) {
                    $(".select-fruit-box").hide();
                    $(".select-type-box").show();

                    $(".select-fruit-box .tips").hide();
                    $(".real-restart-btn").hide();
					
                    this.step = 2;
                } else {
                    $(".select-fruit-box .tips").show();
                }
            } else if (this.step == 2) {
				$(".real-restart-btn").show();
                if (this.type) {
                    $(".select-type-box").hide();
                    $(".select-type-box .tips").hide();
                    this.init_answer_panel();
                } else {
                    $(".select-type-box .tips").show();
                }
            } else if (this.step == 3) {
                this.check_result();
            }
        }.bind(this));

        $(".real-restart-btn").unbind("click");
        $(".real-restart-btn").click(function () {
            $this.init();
        });

        $(".clear-btn").unbind(this);
        $(".clear-btn").click(function () {
            $this.clear();
        });

        $("input[type=number]").each(function () {
            $(this).unbind("keyup");
            $(this).keyup(function () {
                var val = $(this).val();

                val = val.replace(/[^1-9]/gi, "");
                val = val.replace(/(.*)(\d)$/gi, "$2");

                $(this).val(val);
            });
        });

    },

    init_answer_panel : function () {
        $(".answer-box-panel-fruit img").attr("src", "images/1a27ex01/f" + String(this.fruit) + ".png");

        $(".answer-type").hide();
        $(".answer-type").eq(this.type-1).show();

        $(".answer-box").show();

        this.step = 3;

        $(".clear-btn").show();
        
        if (this.new == false)
            this.setDrag(true);
    },

    check_result : function () {
        var checkImg = true;
        $(".answer-box-panel-left li").each(function (index) {
            if ($(this).find("img").size() < 1) {
                checkImg = false;
            }
        });

        if (checkImg == false) {
            this.show_error(LANG.must_fill_with_one_img);
            return false;
        }

        var value1 = $(".answer-type-" + String(this.type) + " [name=value1]").val();
        var value2 = $(".answer-type-" + String(this.type) + " [name=value2]").val();
        var sum = $(".answer-type-" + String(this.type) + " [name=sum]").val();

        var avalue1 = $(".answer-type-" + String(this.type) + " [name=a_value1]").val();
        var avalue2 = $(".answer-type-" + String(this.type) + " [name=a_value2]").val();
        var asum = $(".answer-type-" + String(this.type) + " [name=a_sum]").val();
        
        if ((!(/^\d$/i).test(value1)) || (!(/^\d$/i).test(value2)) || (!(/^\d$/i).test(sum))) {
            this.show_error(LANG.please_input_in_box);
            return false;
        }

        if ((!(/^\d$/i).test(avalue1)) || (!(/^\d$/i).test(avalue2)) || (!(/^\d$/i).test(asum))) {
            this.show_error(LANG.please_input_in_box);
            return false;
        }

        if (value1 == 0 && value2 == 0 && sum == 0) {
            this.show_error(LANG.please_input_in_box);
            return false;
        }

        if (avalue1 == 0 && avalue2 == 0 && asum == 0) {
            this.show_error(LANG.please_input_in_box);
            return false;
        }
        

        var count1 = $(".answer-box-panel-left li").eq(0).find("img").size();
        var count2 = $(".answer-box-panel-left li").eq(1).find("img").size();

        if (count1 != value1 || count2 != value2) {
            this.show_error(LANG.please_input_correct_number);
            return false;
        }

        if (count1 != avalue1 || count2 != avalue2) {
            this.show_error(LANG.please_input_correct_number);
            return false;
        }

        if (sum != (parseInt(value1) + parseInt(value2))) {
            this.show_error(LANG.error_result);
            return false;
        }

        if (asum != (parseInt(avalue1) + parseInt(avalue2))) {
            this.show_error(LANG.error_result);
            return false;
        }

        this.show_success(LANG.answer_success);
    },

    setDrag : function () {
        this.new = true;
        var current_fruit = $(".answer-box-panel-fruit img").get(0);

        $(".answer-box-panel-fruit img").attr("draggable", "true");
        addEvent(current_fruit, "dragstart", function (e) {
            e.dataTransfer.effectAllowed = "copy"; // only dropEffect='copy' will be dropable
            e.dataTransfer.setData('Text', this.fruit); // required otherwise doesn't work

            return true;
        });

        addEvent($(this).get(0), "dragend", function (e) {
            //e.dataTransfer.clearData("text");
            
		    return false
        });

        var $this = this;

        $(".answer-box-panel-left li").each(function (index) {
            
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
                
                var other = $(e.target).siblings().eq(0).find("img").size();
                
                if ($(e.target).find("img").size() + other >= 5) {
                    $this.show_error(LANG.can_not_gt_4, true);
                    return false;
                } else {
                    
                }

                //console.log($this.fruit);

                $(String("<img src='{img_url}' />").replace('{img_url}', "images/1a27ex01/f" + String($this.fruit) + ".png")).appendTo($(e.target));

                return false;
            });


        });
    },

    clear : function () {
        $(".answer-type input").val('');

        $(".answer-box-panel-left li").each(function () {
            $(this).html('');
        });

        $(".answer-msg").hide();
    },

    show_error : function (msg, hide_auto) {

        $(".answer-msg").addClass("answer-msg-error").removeClass("answer-msg-ok");
        $(".answer-msg").html(msg);
        
        $(".answer-msg").show();

        if (arguments.length >= 2 && hide_auto == true) {
            setTimeout(function () {
                $(".answer-msg").fadeOut(800);
            }, 3000);
        }
    },
    
    show_success : function (msg, hide_auto) {

        $(".answer-msg").addClass("answer-msg-ok").removeClass("answer-msg-error");
        $(".answer-msg").html(msg);
        
        $(".answer-msg").fadeIn(800);
    }
};


$(document).ready(function () {
    Algorithm.run();
});
