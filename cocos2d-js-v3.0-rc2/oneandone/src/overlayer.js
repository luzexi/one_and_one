/**
 * Created by luzexi on 14-10-9.
 */



var OverLayer = cc.Layer.extend({

    share_layer:null,
    share_label:null,

    ctor:function()
    {
        this._super();
        var img_bg = new cc.Sprite(res.s_game_bg);
        img_bg.setPosition(0,0);
        img_bg.setAnchorPoint(0,0);
        this.addChild(img_bg);

        var img_finish = new cc.Sprite(res.s_over_finish);
        img_finish.setPosition(g_screen_size.width/2,g_screen_size.height/2+200);
        this.addChild(img_finish);

        var btn_back = new cc.MenuItemImage(res.s_over_back,res.s_over_back,this.back_callback,this);
        btn_back.setPosition(g_screen_size.width/2-100,300);
        var btn_share = new cc.MenuItemImage(res.s_over_share1,res.s_over_share2,this.share_callback,this);
        btn_share.setPosition(g_screen_size.width/2+100,300);
        var btn_menu = new cc.Menu(btn_back,btn_share);
        btn_menu.setPosition(0,0);
        this.addChild(btn_menu);
    },

    back_callback:function()
    {
        cc.director.runScene(new GameScene());
    },

    share_callback:function()
    {
        this.remove_sharelayer();
        this.share_layer = new cc.LayerColor(cc.color(0,0,0,200));
        this.share_label = cc.LabelTTF.create("点击分享朋友圈↑↑↑","",30);
        this.share_label.setColor(cc.color(255,0,0));
        this.share_label.setPosition(g_screen_size.width - 150 , g_screen_size.height -30);
        this.addChild(this.share_layer);
        this.addChild(this.share_label);

        var listen = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded:function (touches, event) {
                if (touches.length <= 0)
                    return;
//                event.getCurrentTarget().moveSprite(touches[0].getLocation());
                event.getCurrentTarget().remove_sharelayer();
                cc.eventManager.removeListener(listen);
            }
        });
        cc.eventManager.addListener( listen , this);
    },

    remove_sharelayer:function()
    {
        if(this.share_layer != null )
        {
            this.share_layer.removeFromParent(true);
            this.share_layer = null;
        }
        if(this.share_label != null)
        {
            this.share_label.removeFromParent(true);
            this.share_label = null;
        }
    }

});

var OverScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new OverLayer();
        this.addChild(layer);
    }
});
