/**
 * Created by luzexi on 14-10-8.
 */


var g_screen_size = null;


var GameLayer = cc.Layer.extend({

    lst_btn:null,
    lst_num:null,
    lst_down:null,

    sum_num:0,
    txt_sum:null,
    now_posx:-1,
    now_posy:-1,
    event_listener:null,
    touch_down:false,

    ctor:function()
    {
        this._super();

        g_screen_size = cc.winSize;

        var img_bg = new cc.Sprite(res.s_game_bg);
        img_bg.setPosition(0,0);
        img_bg.setAnchorPoint(0,0);
        this.addChild(img_bg);

        var img_tittle = new cc.Sprite(res.s_game_tittle);
        img_tittle.setPosition(g_screen_size.width/2,g_screen_size.height-100);
        img_tittle.setAnchorPoint(0.5,0.5);
        this.addChild(img_tittle);

        var txt_readme = new cc.LabelTTF("数字相连，等于总和","",30);
        txt_readme.setPosition(g_screen_size.width/2 , 200);
        this.addChild(txt_readme);

        var btn_play = new cc.MenuItemImage(res.s_game_playbtn1,res.s_game_playbtn2,null,this);
        btn_play.setPosition(0,0);
        btn_play.setAnchorPoint(0.5,0.5);
        var btn_menu_play = new cc.Menu(btn_play);
        btn_menu_play.setPosition(g_screen_size.width/2,100);
        this.addChild(btn_menu_play);

        this.txt_sum = new cc.LabelTTF("12","",50);
        this.txt_sum.setColor(cc.color(0,0,0,255));
        this.txt_sum.setPosition(g_screen_size.width/2,g_screen_size.height/2+200);
        this.addChild(this.txt_sum);

        this.randomBtn();

        cc.eventManager.addListener(
            {
                event : cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan: this.onTouchesBegan,
                onTouchesMoved: this.onTouchesMoved,
                onTouchesEnded: this.onTouchesEnded,
                onTouchesCancelled: this.onTouchesCancelled
            },this
        );
    },

    isNumBtn:function( obj )
    {
        var pos = obj.getLocation();
        if(pos.x > 135 && pos.x < (135 + 5*70))
        {
            if(pos.y < 625 && pos.y > (625 - 5*70))
                return true;
        }
        return false;
    },

    getNumSize:function( x , y)
    {
        var size = cc.size(0,0);
        size.width = parseInt( (x-135)/70 );
        size.height = parseInt( (y-(625-5*70))/70 );

        return size;
    },

    updateNum:function(x,y)
    {
        var pos = this.getNumSize(x,y);
        if(this.now_posx != -1 && this.now_posy != -1)
        {
            if( Math.abs( pos.width - this.now_posx ) + Math.abs( pos.height - this.now_posy ) != 1 )
            {
                return;
            }
        }
        if(!this.lst_down[pos.width*5+pos.height])
        {
            this.lst_down[pos.width*5+pos.height] = true;
            this.now_posx = pos.width;
            this.now_posy = pos.height;
            this.lst_btn[pos.width*5+pos.height].removeFromParent(true);
            switch(this.lst_num[pos.width*5+pos.height])
            {
                case 1:
                    this.lst_btn[pos.width*5+pos.height] = new cc.Sprite(res.s_game_down1);
                    break;
                case 2:
                    this.lst_btn[pos.width*5+pos.height] = new cc.Sprite(res.s_game_down2);
                    break;
                case 3:
                    this.lst_btn[pos.width*5+pos.height] = new cc.Sprite(res.s_game_down3);
                    break;
            }
            this.addChild(this.lst_btn[pos.width*5+pos.height]);
            this.lst_btn[pos.width*5+pos.height].setPosition(
                    g_screen_size.width/2 - 150 + pos.width*70,
                    g_screen_size.height/2 - 170 + pos.height*70
            );
        }
    },

    calculate:function()
    {
        var sum = 0;
        for(var i = 0 ; i < this.lst_num.length ; i++ )
        {
            if(this.lst_down[i])
            {
                sum += this.lst_num[i];
            }
        }
        if(sum == this.sum_num)
            return true;
        return false;
    },

    randomBtn:function()
    {
        this.sum_num = Math.ceil( Math.random()*15 + 2 );
        this.txt_sum.setString(""+this.sum_num);
        this.txt_sum.setPosition(g_screen_size.width,g_screen_size.height/2+200)
        var move_ac = cc.moveTo(0.2,cc.p(g_screen_size.width/2,g_screen_size.height/2+200));
        this.txt_sum.runAction(move_ac);
        //
        this.touch_down = false;
        this.now_posx = -1;
        this.now_posy = -1;
        this.lst_btn = [];
        this.lst_num = [];
        this.lst_down = [];
        for(var i = 0 ; i<5 ;i++)
        {
            for(var j = 0 ; j<5 ; j++)
            {
                var random_num = Math.ceil( Math.random()*3 );

                var btn_num = null;
                switch(random_num)
                {
                    case 1:
                        btn_num = new cc.Sprite(res.s_game_num1);
                        break;
                    case 2:
                        btn_num = new cc.Sprite(res.s_game_num2);
                        break;
                    case 3:
                        btn_num = new cc.Sprite(res.s_game_num3);
                        break;
                }
                btn_num.setPosition( g_screen_size.width/2 - 150 + i*70, g_screen_size.height/2 -170 + j*70);
                this.addChild(btn_num);
                this.lst_btn.push(btn_num);
                this.lst_num.push(random_num);
                this.lst_down.push(false);
            }
        }
    },

    onTouchesBegan:function(touches, event) {
        var target = event.getCurrentTarget();
        for (var i=0; i < touches.length;i++ ) {
            var touch = touches[i];
            if(!target.isNumBtn(touch)) continue;
            target.touch_down = true;
            var pos = touch.getLocation();
            var id = touch.getID();
//            cc.log("Touch #" + i + ". onTouchesBegan at: " + pos.x + " " + pos.y + " Id:" + id);
            var btn_pos = target.getNumSize(pos.x,pos.y);
//            cc.log("btn pos x " + btn_pos.width + " " + btn_pos.height);
            target.updateNum(pos.x,pos.y);
        }
    },
    onTouchesMoved:function(touches, event) {
        var target = event.getCurrentTarget();
        for (var i=0; i < touches.length;i++ ) {
            var touch = touches[i];
            if(!target.isNumBtn(touch)) continue;
            var pos = touch.getLocation();
            var id = touch.getID();
//            cc.log("Touch #" + i + ". onTouchesMoved at: " + pos.x + " " + pos.y + " Id:" + id);
            var btn_pos = target.getNumSize(pos.x,pos.y);
//            cc.log("btn pos x " + btn_pos.width + " " + btn_pos.height);
            target.updateNum(pos.x,pos.y);
        }
    },
    onTouchesEnded:function(touches, event) {
        var target = event.getCurrentTarget();
        var touch = touches[0];
        if(!target.touch_down) return;

        if(target.calculate())
        {
            cc.log("ok you win");
            target.randomBtn();
        }
        else
        {
            cc.director.runScene(new OverScene());
        }
    },
    onTouchesCancelled:function(touches, event) {
        //
    }

});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});