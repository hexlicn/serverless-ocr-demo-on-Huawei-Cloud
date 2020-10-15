// init
var fs = require('fs');
var ObsClient = require('esdk-obs-nodejs');

// create ObsClient instance
var obsClient = new ObsClient({
       access_key_id: '<input_your_ak>',
       secret_access_key: '<input_your_sk>',
       server : 'obs.ap-southeast-2.myhuaweicloud.com',
       max_retry_count : 1,
       timeout : 200,
       ssl_verify : false,
       long_conn_param : 0
});

// declare params
exports.handler = (event, context, callback) => {
       console.log('Processing request from apig trigger');
       
       let bodyStr = event.body;
       if (event.isBase64Encoded == true){
           var base64data = new Buffer(event.body, 'base64');
           bodyStr = base64data.toString();
       }
       
       var body = JSON.parse(bodyStr);
       //console.log('body(JSON String): ' + body);
       
       let recieved_request = JSON.stringify(body.img);
       let recieved_request_imageId = JSON.stringify(body.imageID);
       let recieved_request_ext = JSON.stringify(body.fileExt);
       let recieved_request_folder = JSON.stringify(body.folder);
       
       recieved_request = recieved_request.slice(1, -1);
        var filePath = recieved_request_imageId + "." + recieved_request_ext.replace('"','').replace('"','');  //remove spaces
        var contentBase64 = recieved_request.replace(/^(.+?),/, "")
        var contentBuff = new Buffer.from(contentBase64, 'base64');
        
        var tmpPath = '/tmp/' + filePath
        
        let response =  {
            'statusCode': 200,
            'isBase64Encoded': false,
            'headers': {
                'Content-type': 'application/json'
            },
            'body': 'ok'
        };
        
        fs.writeFile(tmpPath, contentBuff, 'binary', function (error) {
            if (error) {
                console.log('Write file failed')
                response.statusCode = 500
                response.body = "write failed"
                callback(null, response);
                return
            } else {
                console.log('write file success')
            }
        })
      
       //upload objects
       obsClient.putObject({
            Bucket: "react-ap-webapp-images",
            Key: filePath,
            SourceFile: tmpPath
       },(err, result) => {
              if(err){
                    console.error('Error-->' + err);
                    response.statusCode = 500
                    response.body = '001' + err
                    callback(null, response);
                    return
              }else{
                     if(result.CommonMsg.Status < 300){
                            console.log('RequestId-->' + result.InterfaceResult.RequestId);
                            console.log('ETag-->' + result.InterfaceResult.ETag);
                            console.log('VersionId-->' + result.InterfaceResult.VersionId);
                            console.log('StorageClass-->' + result.InterfaceResult.StorageClass);
                     }else{
                            console.log('Code-->' + result.CommonMsg.Code);
                            console.log('Message-->' + result.CommonMsg.Message);
                     }
              }
       });
       callback(null, response);
}
