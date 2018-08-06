cc.Class({
    extends: cc.Component,

    properties: {
        button1: {
            default: null,
            type: cc.Node
        },

        button2: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.button1.on('click', this.shot1, this);
        this.button2.on('click', this.shot2, this);
    },

    shot1: function (callback) {
        let self = this;
        let size = cc.director.getWinSize();

        // 把截图内容放大左下角
        let cocos = cc.find('cocos', this.node);

        // 创建 renderTexture
        let renderTexture = cc.RenderTexture.create(
            cocos.width,
            cocos.height,
            cc.Texture2D.PIXEL_FORMAT_RGBA8888,
            gl.DEPTH24_STENCIL8_OES
        );
        let originPosition = cocos.position;
        cocos.position = cc.p((cocos.width - size.width) / 2, (cocos.height - size.height) / 2);

        renderTexture.begin();
        cc.director.getScene().getChildByName('Canvas')._sgNode.visit();
        renderTexture.end();

        // 隐藏被截图的对象
        cocos.active = false;

        //保存截图到本地
        renderTexture.saveToFile('shot.png', cc.ImageFormat.PNG, true, function () {
            cocos.position = originPosition;
            cocos.scale = 1;
            cocos.active = true;
            cc.log('----capture screen successfully!');
        });
    },

    shot2: function (callback) {
        let self = this;

        let cocos = cc.find('cocos2/cocos2', this.node);
        // 创建 renderTexture
        let renderTexture = cc.RenderTexture.create(
            cocos.width,
            cocos.height,
            cc.Texture2D.PIXEL_FORMAT_RGBA8888,
            gl.DEPTH24_STENCIL8_OES
        );

        renderTexture.begin();
        cocos._sgNode.visit();
        renderTexture.end();
        // 使用这个截图还是有问题
        // cocos._sgNode.addChild(renderTexture , 9999);
        cocos.active = false;

        // 保存截图到本地
        renderTexture.saveToFile('shot.png', cc.ImageFormat.PNG, true, function () {
            cc.log('----capture screen successfully!');

            // 将图片显示在界面上, 替换原有node
            let imagePath = cc.path.join(jsb.fileUtils.getWritablePath(), 'shot.png');
            cc.loader.load(imagePath, function (err, tex) {
                var spf = new cc.SpriteFrame();
                spf.initWithTexture(tex);
                cc.find('cocos2', self.node).getComponent(cc.Sprite).spriteFrame = spf;
            });
        });
    }
});
