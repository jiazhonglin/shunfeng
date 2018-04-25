var https = require('https')
var url_mod = require('url')
var mail = function (config) {
    this.sf_appid = config.sf_appid,
        this.sf_appkey = config.sf_appkey,
        this.custId = config.custId,
        this.payMethod = config.payMethod,
        this.expressType = config.expressType
    this.domain = config.domain
}
var URLS = {
    filter: 'https://' + this.domain + '/rest/v1.0/filter/access_token/{access_token}/sf_appid' + '/{sf_appid}/sf_appkey/{sf_appkey}',
    routeQuery: 'https://' + this.domain + '/rest/v1.0/route/query/access_token/{access_token}/sf_appid' + '/{sf_appid}/sf_appkey/{sf_appkey}'
}
var accessToken = 'hehe'
var refreshToken = 'haha'
//发送https请求
mail.prototype._httpsRequest = function (url, data, callback) {
    var parsed_url = url_mod.parse(url);
    var req = https.request({
        host: parsed_url.host,
        port: 443,
        path: parsed_url.path,
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        }
    }, function (res) {
        var content = '';
        res.on('data', function (chunk) {
            content += chunk;
        });
        res.on('end', function () {
            callback(null, content);
        });
    });
    req.on('error', function (e) {
        callback(e);
    });
    req.write(data);
    req.end();
};

//获取token
mail.prototype.getToken = function (config, cb) {
    var params = { "head": { "transType": "301", "transMessageId": config.transMessageId } }
    var data = JSON.stringify(params)
    var url = 'https://' + this.domain + '/public/v1.0/security/access_token' + '/sf_appid/' + this.sf_appid + '/sf_appkey/' + this.sf_appkey
    this._httpsRequest(url, data, function (err, content) {
        if (err) {
            return cb(err)
        }
        var content = JSON.parse(content)
        if (content.head.code = 'EX_CODE_OPENAPI_0200') {
            accessToken = content.body.accessToken
            refreshToken == content.body.refreshToken
            cb(err)
        } else {
            var err = new Error(content.head.message)
            throw err
        }
    })
}
//刷新token
// mail.prototype.refreshToken = function (cb) {
//     var params = { "head": { "transType": "302", "transMessageId": "201408192052000001" } }
//     var url = 'https://' + this.domain + '/public/v1.0/security/refresh_token/access_token/' + accessToken + '/refresh_token/' + refreshToken + '/sf_appid/' + this.sf_appid + '/sf_appkey/' + this.sf_appkey
//     var data = JSON.stringify(params)
//     this._httpsRequest(url, data, function (err, content) {
//         if (err) {
//             return cb(err)
//         }
//         var content = JSON.parse(content)

//         if (result.head.code == 'EX_CODE_OPENAPI_0103' | result.head.code == 'EX_CODE_OPENAPI_0104' | result.head.code == 'EX_CODE_OPENAPI_0105' | result.head.code == 'EX_CODE_OPENAPI_0106') {
//             that.getToken(config, function (err) {
//                 that.refreshToken(cb)
//             })
//         } else if (result.head.code == 'EX_CODE_OPENAPI_0200') {
//             accessToken = content.body.accessToken
//             cb(null, result)
//         } else { throw new Error(result.head.message) }

//     })
// }
// 下订单
mail.prototype.order = function (config, cb) {
    var that = this
    var url = 'https://' + that.domain + '/rest/v1.0/order/access_token/' + accessToken + '/sf_appid/' + that.sf_appid + '/sf_appkey/' + that.sf_appkey
    var params = {
        "head": {
            "transMessageId": config.transMessageId,
            "transType": 200
        },
        "body": {
            "cargoInfo": {
                "cargo": config.cargo,//物品名称
            },
            "consigneeInfo": {
                "address": config.caddress,//详细地址
                "city": config.ccity,//收件人城市
                "company": config.ccompany,//到件公司名称
                "contact": config.ccontact,//到件人姓名
                "province": config.cprovince,//到件人省份
                "tel": config.ctel,//到件人电话
            },
            "deliverInfo": {
                "address": config.daddress,//寄件地址
                "city": config.dcity,//寄件城市
                "company": config.dcompany,//寄件公司
                "contact": config.dcontact,//寄件人
                "province": config.dprovince,//寄件方省份
                "tel": config.dtel//寄件人手机号
            },
            "custId": that.custId,//月结卡号
            "expressType": that.expressType,//快件产品类型
            "orderId": config.orderId,//客户订单号
            "payMethod": that.payMethod,//寄送方式
        }
    }
    params = JSON.stringify(params)
    that._httpsRequest(url, params, function (err, content) {
        if (err) {
            throw new Error(err)
        }
        var result = JSON.parse(content)
        if (result.head.code == 'EX_CODE_OPENAPI_0103' | result.head.code == 'EX_CODE_OPENAPI_0105') {
            that.getToken(config, function (err, token) {
                that.order(config, cb)
            })
        } else if (result.head.code == 'EX_CODE_OPENAPI_0200') {
            cb(null, result)
        } else { throw new Error(result.head.message) }
    })
}
//查询结果
mail.prototype.query = function (config, cb) {
    var that = this
    var url = 'https://' + this.domain + '/rest/v1.0/order/query/access_token/' + accessToken + '/sf_appid/' + this.sf_appid + '/sf_appkey/' + this.sf_appkey
    var params = {
        "head": {
            "transMessageId": config.transMessageId,
            "transType": 203
        },
        "body": {
            "orderId": config.orderId
        }
    }
    params = JSON.stringify(params)
    this._httpsRequest(url, params, function (err, content) {
        if (err) {
            return cb(err)
        }
        var result = JSON.parse(content)
        if (result.head.code == 'EX_CODE_OPENAPI_0103' | result.head.code == 'EX_CODE_OPENAPI_0105') {
            that.getToken(config, function (err) {
                that.query(config, cb)
            })
        } else if (result.head.code == 'EX_CODE_OPENAPI_0200') {
            cb(null, result)
        } else { throw new Error(result.head.message) }
    })
}

mail.prototype.filter = function (area, config, cb) {
    var that = this
    var url = 'https://' + this.domain + '/rest/v1.0/filter/access_token/' + accessToken + '/sf_appid/' + this.sf_appid + '/sf_appkey/' + this.sf_appkey
    var params = {
        "head": {
            "transMessageId": config.transMessageId,
            "transType": 204
        },
        "body": area
    }
    params = JSON.stringify(params)
    this._httpsRequest(url, params, function (err, content) {
        if (err) {
            return cb(err)
        }
        var result = JSON.parse(content)
        console.log(result)
        if (result.head.code == 'EX_CODE_OPENAPI_0103' | result.head.code == 'EX_CODE_OPENAPI_0105') {
            that.getToken(config, function (err) {
                that.filter(area, config, cb)
            })
        } else if (result.head.code == 'EX_CODE_OPENAPI_0200') {
            cb(null, result)
        } else { throw new Error(result.head.message) }
    })
}
//路由查询
mail.prototype.route = function (config, cb) {
    var that = this
    var url = 'https://' + this.domain + '/rest/v1.0/route/query/access_token/' + accessToken + '/sf_appid/' + this.sf_appid + '/sf_appkey/' + this.sf_appkey
    var params = {
        "head": {
            "transMessageId": config.transMessageId,
            "transType": 501
        },
        "body": {
            "trackingType": "2",
            "trackingNumber": config.orderId,
            "methodType": "1"
        }
    }
    params = JSON.stringify(params)
    this._httpsRequest(url, params, function (err, content) {
        if (err) {
            return cb(err)
        }
        var result = JSON.parse(content)
        console.log(result)
        if (result.head.code == 'EX_CODE_OPENAPI_0103' | result.head.code == 'EX_CODE_OPENAPI_0105') {
            that.getToken(config, function (err) {
                that.route(trackingNumber, config, cb)
            })
        } else if (result.head.code == 'EX_CODE_OPENAPI_0200') {
            cb(null, result)
        } else { throw new Error(result.head.message) }
    })
}
//电子运单下载
mail.prototype.waybill = function (config, cb) {
    var that = this
    var url = 'https://' + this.domain + '/rest/v1.0/waybill/image/access_token/' + accessToken + '/sf_appid/' + this.sf_appid + '/sf_appkey/' + this.sf_appkey
    var params = {
        "head": {
            "transMessageId": config.transMessageId,
            "transType": 205
        },
        "body": {
            "orderId": config.orderId
        }
    }
    params = JSON.stringify(params)
    this._httpsRequest(url, params, function (err, content) {
        if (err) {
            return cb(err)
        }
        var result = JSON.parse(content)
        if (result.head.code == 'EX_CODE_OPENAPI_0103' | result.head.code == 'EX_CODE_OPENAPI_0105') {
            that.getToken(config, function (err) {
                that.waybill(config, cb)
            })
        } else if (result.head.code == 'EX_CODE_OPENAPI_0200') {
            cb(null, result)
        } else { throw new Error(result.head.message) }
    })
}

exports.mail = mail


