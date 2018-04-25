# 顺丰快递 for Nodejs

## 初始化
```js
var Mail = require('shunfeng-api').mail
var fs = require('fs')
var path = require('path')
var config = {
    sf_appid: '',
    sf_appkey: '',
    custId: '7550010173',
    payMethod: 1,
    expressType: 1,
    domain: 'open-sbox.sf-express.com'
}
var newmail = new Mail(config)
var pa = {//举个例子
    ctransMessageId: '201404880000000001',
    ccargo: 'iphone5s',//物品名称
    cprovince: '广东',//省份
    ccity: '深圳',//城市
    corderId: '20141225185523974148888',//客户订单号
    caddress: "世界第一广场",//详细地址
    ccontact: "黄飞鸿",//到件人姓名
    ctel: "075533915561",//到件人电话
    ccompany: '我公司',//收件人公司

    daddress: "海淀区上地一路中关村神罗科技大厦",//寄件地址
    dcity: "北京",//寄件城市Ï
    dcompany: "神罗科技",//寄件公司
    dcontact: "李嘟嘟",//寄件人
    dprovince: "北京",//寄件方省份
    dtel: "010-95127777"//寄件人手机号
}
```
所有参数都是必须的，这样配置最省事。(每次的orderId必须不一样，否则报错)

## 查询地址是否可送达
```javascript
    var area = {
        "filterType": "1",
        "consigneeCountry": "中国",
        "consigneeProvince": "广东省",
        "consigneeCity": "深圳市",
        "consigneeCounty": "福田区",
        "consigneeAddress": "新洲十一街万基商务大厦"
    }
    newmail.filter(area, pa, function (err, result) {
        res.send(result)
    })
```

## 下个订单吧

```javascript
newmail.order(pa, function (err, result) {
        res.send(result)
    })
```

## 查询一下订单吧

```javascript
newmail.query( pa, function (err, result) {
        res.send(result)
    })
```
## 查询路由

```javascript
newmail.route( pa, function (err, result) {
        res.send(result)
    })
```
## 生成快递单

```javascript
newmail.waybill( pa, function (err, result) {
        var dataBuffer = new Buffer(result.body.images[0], 'base64')
        var newPath = path.join(__dirname, "../public/images/out.png")
        fs.writeFile(newPath, dataBuffer, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("保存成功！");
            }
        });
    })
```