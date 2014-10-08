/**
 * Created by luzexi on 14-10-8.
 */


var g_screen_size = null;


var GameLayer = cc.Layer.extend({

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

        var txt_sum = new cc.LabelTTF("12","",50);
        txt_sum.setColor(cc.color(0,0,0,255));
        txt_sum.setPosition(g_screen_size.width/2,g_screen_size.height/2+200);
        this.addChild(txt_sum);

        for(var i = 0 ; i<5 ;i++)
        {
            for(var j = 0 ; j<5 ; j++)
            {
                var btn_num = new cc.MenuItemImage(res.s_game_num1,res.s_game_down1,null,this);
                btn_num.setAnchorPoint(0,0);
                var btn_menu_num = new cc.Menu(btn_num);
                btn_menu_num.setPosition( g_screen_size.width/2 - 170 + i*70, g_screen_size.height/2 -220 + j*70);
                btn_menu_num.setAnchorPoint(0.5,0.5);
                this.addChild(btn_menu_num);
            }
        }
    }

});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});