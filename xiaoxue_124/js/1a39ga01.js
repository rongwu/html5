/**
 * 小学算术 39
 * @Author: qiongyue
 * @Date: 2014/06/28
 */


Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function Point (x, y) {
    this.x = x;
    this.y = y;
    
    return this;
}

function Line (s, d, t) {
    this.s = s;
    this.d = d;
	this.line_type = (arguments.length > 2)?t:0;
	
    return this;
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

var Algorithm39 = {
    pref : {
        time : 30,
        step_score: 10,
        step_count : 10,
        image_types: 6,
        questions : [
            [8, 4, 4], [8, 3, 5], [8, 2, 6],
            [7, 4, 3], [7, 2, 5], [7, 1, 6],
            [6, 4, 2], [6, 5, 1], [6, 3, 3],
            [5, 4, 1], [5, 3, 2],
            [4, 3, 1], [4, 2, 2]
        ]
    },

    step: 0,
    image_type: null,
    remain_time : 0,
    score: 0,
    timer : null,
    questions : [],
    question : [],

    temp : {},

    cvs : null,
    ctx: null,
    cvs_width: null,
    cvs_height:null,
    
    run: function () {
        this.init();
    },

    init : function () {
        //显示说明
        $(".start-page li").first().click(function () {
            this.show_intro();
        }.bind(this));

        //开始
        $(".start-page li").last().click(function () {
            $(".start-page").hide();

            this.init_answer_panel();
        }.bind(this));
        
    },

    show_intro : function () {
        $(".intro").show();
        $(".intro .intro-middle").html('<embed src="images/1a39ga01/tips.svg" width="544" height="78" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" id="svg-box" />');

        $(".intro .close-btn").unbind("click");
        $(".intro .close-btn").click(function() {
            $(".intro").hide();
        });
    },

    init_answer_panel : function () {
        this.step = 0;
        this.questions = this.pref.questions;
        this.remain_time = this.pref.time;

        $(".answer-panel-top-0").html("00:" + String(this.remain_time));

        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(function () {
            if (this.remain_time <= 0) {
                this.show_error(LANG.timeout);

                clearInterval(this.timer);
                return ;
            }
            
            this.remain_time--;

            if (this.remain_time < 10)
                $(".answer-panel-top-0").html("00:0" + String(this.remain_time));
            else
                $(".answer-panel-top-0").html("00:" + String(this.remain_time));
        }.bind(this), 1000);

        this.next_answer();
        

        this.init_canvas();

        $(".answer-panel").show();
    },

    next_answer : function () {
        if (this.step == this.pref.step_count) { //完成
            this.show_success(LANG.success);
            
            clearInterval(this.timer);
            return ;
        }


        this.step = this.step + 1;
        this.image_type = this.get_image_type();
        this.question = this.get_question();

        $(this.question).each(function (index, item) {
            var output = "";
            if (index == 0) {
                for (var i=0;i<item;i++) {
                    output += String('<img src="images/1a39ga01/f{type}.png" />').replace('{type}', this.image_type);
                }

                $(".answer-panel-middle .answer-panel-middle-t").html(output);
            } 
        }.bind(this));

        var candidate = this.get_candidate(); //生成选项

        $(candidate).each(function (index, item) {
            var output = "";
            
            for (var i=0;i<item;i++) {
                output += String('<img src="images/1a39ga01/f{type}.png" />').replace('{type}', this.image_type);
            }

            $(".answer-panel-middle-b li").eq(index).html(output);
            $(".answer-panel-middle-b li").eq(index).removeClass("f1");
            $(".answer-panel-middle-b li").eq(index).addClass('f' + String(this.image_type));
        }.bind(this));
    },

    get_image_type : function () {
        var r = this.random(this.pref.image_types);

        if (r == 0) r = 1;

        return r;
    },

    random : function (max) {
        return Math.floor(Math.random() * 100 % (max+1));
    },

    get_question : function () {
        var i = this.random(this.questions.length-1);

        var q = this.questions[i];

        this.questions.remove(i);

        return q;
    },

    get_candidate : function () {
        var c = [this.question[1], this.question[2]];

        var t = [1, 2, 3, 4, 5, 6];
        $(t).each(function (index, item) {
            if ($.inArray(item, c) !== -1) {
                t.remove(index);
            }
        });

        t = shuffle(t);

        c.push(t[0]);
        c.push(t[1]);

        c = shuffle(c);
        
        return c;
    },

    check_result : function () {
        var sum = $(".answer-panel-middle-t img").size();
        var val1 = $(".answer-panel-middle-b li").eq(this.temp.answer[0]).find("img").size();
        var val2 = $(".answer-panel-middle-b li").eq(this.temp.answer[1]).find("img").size();

        if (sum == (val1 + val2)) {
            this.score += this.pref.step_score;

            $(".answer-panel-top-1 .score").html(this.score);
        }

        if (this.step == this.pref.step_count) {
            //complete

            return ;
        }

        this.next_answer();
        
    },

    clear : function () {
        
    },

    drap_line : function () {
        
    },

    init_canvas : function () {
        this.cvs = document.getElementById('main-canvas');
        this.ctx = this.cvs.getContext("2d");

        this.cvs_width = $("#main-canvas").width();
        this.cvs_height = $("#main-canvas").height();  

        
        this.cvs.setAttribute('width', this.cvs_width);
        this.cvs.setAttribute('height', this.cvs_height);

        //定义锚点
        var topActiveRegion = [];
        var bottomActiveRegions = [];
        var focusPoint = new Point(Math.floor(this.cvs_width/2), 0);
        var dy = 80;
        var dx = $(".answer-panel-middle-b li").eq(0).width();
        dx = 176;
        var dxPadding = $(".answer-panel-middle-b li").eq(0).css('margin-right').replace('px', '');
        var dxhalf = Math.floor(dx / 2);
        var selectPoints = [
            new Point(dx * 0 + dxhalf, dy),
            new Point(dx * 1 + dxPadding * 1 + dxhalf, dy),
            new Point(dx * 2 + dxPadding * 2 + dxhalf, dy),
            new Point(dx * 3 + dxPadding * 3 + dxhalf, dy),
        ];

         topActiveRegion.push([new Point(focusPoint.x-160, 0)], 320, 10);
        $(selectPoints).each(function (index, p) {
             var sharp = [new Point(p.x-dxhalf, p.y-20), dx, 20];

            bottomActiveRegions.push(sharp);
        }.bind(this));


        this.temp.startPoint = null;
        this.temp.endPoint = null;
        this.temp.answer = [];
        this.temp.currentPoints = [];
        this.add_operate_event(focusPoint, selectPoints, topActiveRegion, bottomActiveRegions);
    },

    contain : function (p, sharp) {
        if (p.x - sharp[0].x < 0 || p.x-sharp[0].x > sharp[1]) {
            return false;
        }

        if (p.y - sharp[0].y < 0 || p.y-sharp[0].y > sharp[2]) {
            return false;
        }

        return true;
    },

    add_operate_event : function (focusPoint, selectPoints, topActiveRegion, bottomActiveRegions) {

        this.cvs.addEventListener("mousemove", function (e) {
            if (this.temp.draw_mode != 1) return ;
            
            var p = new Point(0, 0);
            
            p.x = e ? e.clientX : event.x;
		    p.y = e ? e.clientY : event.y;
            p.x -= ($(this.cvs).offset().left);
            p.y -= ($(this.cvs).offset().top);
            
            
            this.user_operate(p,focusPoint, selectPoints, topActiveRegion, bottomActiveRegions, 1);
        }.bind(this), false);
        
        this.cvs.addEventListener("mouseup", function (e) {
            if (this.temp.draw_mode != 1) return ;
            
            var p = new Point(0, 0);
            
            p.x = e ? e.clientX : event.x;
		    p.y = e ? e.clientY : event.y;
            p.x -= ($(this.cvs).offset().left);
            p.y -= ($(this.cvs).offset().top);
            
            
            this.user_operate(p,focusPoint, selectPoints, topActiveRegion, bottomActiveRegions, 0);
        }.bind(this), false);

        
        this.cvs.addEventListener("mousedown", function (e) {
            if (this.temp.draw_mode == 1) return ;

            var p = new Point(0, 0);
            
            p.x = e ? e.clientX : event.x;
		    p.y = e ? e.clientY : event.y;
            p.x -= ($(this.cvs).offset().left);
            p.y -= ($(this.cvs).offset().top);

            if (this.contain(p, topActiveRegion)) {
                this.temp.draw_mode = 1; //开始选择
            }
            
        }.bind(this), false);


        this.cvs.addEventListener("mouseout", function (e) {
            this.temp.draw_mode = 0;
            this.draw_line();
        }.bind(this), false);
    },

    user_operate : function (p, focusPoint, selectPoints, topActiveRegion, bottomActiveRegions, type) {
        if (this.contain(p, topActiveRegion)) {
            this.temp.startPoint = focusPoint;
        }

        if (type == 1 && this.temp.startPoint) {
            this.draw_line();
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 3;
            this.ctx.moveTo(focusPoint.x, focusPoint.y);
            this.ctx.lineTo(p.x, p.y);
            this.ctx.stroke();

            return ;
        }
        
        
        if (this.temp.startPoint) {
            $(bottomActiveRegions).each(function (index, item) {
                if (this.contain(p, item)) {
                    this.temp.endPoint = selectPoints[index];
                    this.temp.answer.push(index);
                    this.temp.currentPoints.push(new Line( this.temp.startPoint, this.temp.endPoint));
                    
                    this.draw_line();
                    this.temp.draw_mode = 0;

                    this.temp.startPoint = null;
                    this.temp.endPoint = null;
                }
                
            }.bind(this));
        }

        
    },

    draw_line : function () {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        
        $(this.temp.currentPoints).each(function (index, item) {
            this.ctx.beginPath();

            this.ctx.strokeStyle = "red";

            this.ctx.lineWidth = 3;
            this.ctx.moveTo(item.s.x, item.s.y);
            this.ctx.lineTo(item.d.x, item.d.y);
            this.ctx.stroke();
        }.bind(this));
        

        if (this.temp.currentPoints.length == 2) { //check answer
            this.check_result();
            this.temp.startPoint = null;
            this.temp.endPoint = null;
            this.temp.answer = [];
            this.temp.currentPoints = [];

            this.draw_line();
        }
    },

    show_error : function (msg, hide_auto) {
        this. show_success(msg, hide_auto);
    },
    
    
    show_success : function (msg, hide_auto) {
        $(".show-result-content").addClass("answer-msg-ok").removeClass("answer-msg-error");
        $(".show-result-content").html(msg);
        
        $(".show-result").fadeIn(800);
    }
};


$(document).ready(function () {
    Algorithm39.run();
});
