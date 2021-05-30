var COS = require('cos-nodejs-sdk-v5');
const auth = require('./auth')
var STS = require('qcloud-cos-sts');
var request = require('request');
const {
    Router
} = require("express")
const router = Router()
//  let SecretId='AKIDZ1M6h9TckXCjgTdg3Unz3zGR4Zw8Zr7E'
//  let SecretKey='BiAQWRBhx0sVluoTN3Yo25f3Bk4AzXqT'

var allowActions = [
    'name/cos:PutObject',
    'name/cos:InitiateMultipartUpload',
    'name/cos:ListMultipartUploads',
    'name/cos:ListParts',
    'name/cos:UploadPart',
    'name/cos:CompleteMultipartUpload'
];
let ossUrl = ''
const config = {
    secretId: "AKIDZ1M6h9TckXCjgTdg3Unz3zGR4Zw8Zr7E", // 替换你的固定密钥
    secretKey: 'BiAQWRBhx0sVluoTN3Yo25f3Bk4AzXqT', //替换你的固定密钥
    // secretId: "AKIDrX6UTJTznW6VQhicHgsztfJZcMmUf5uu", // 替换你的固定密钥
    // secretKey:'zrZ3NWUDjaFO1SfnhfR1UP7pOjwxb3B7',  //替换你的固定密钥
    proxy: '',
    durationSeconds: 1800, // 密钥有效期
    // 放行判断相关参数
    bucket: 'zk-1256024584', // 换成你的 bucket
    region: 'ap-guangzhou', // 换成 bucket 所在地区
    // bucket: 'zk-1256024584', // 换成你的 bucket
    // region: 'ap-guangzhou', // 换成 bucket 所在地区
    allowPrefix: '*', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    allowActions: [
        // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload'
    ],
};

// 处理跨域
//   app.use(cors())

router.get('/sts', auth, (req, res) => {
    // 获取临时密钥

    var shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'));
    var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
    var policy = {
        'version': '2.0',
        'statement': [{
            'action': config.allowActions,
            'effect': 'allow',
            'principal': {
                'qcs': ['*']
            },
            'resource': [
                'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
            ],
        }],
    };
    STS.getCredential({
        secretId: config.secretId,
        secretKey: config.secretKey,
        proxy: config.proxy,
        durationSeconds: config.durationSeconds,
        policy: policy,
    }, function (err, tempKeys) {
        var result = (err || tempKeys) || '';
        //   res.send(result);
        res.json({
            code: 200,
            data: result
        })
    });
})
module.exports = router