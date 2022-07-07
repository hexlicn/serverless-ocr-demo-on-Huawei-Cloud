# serverless-ocr-demo-on-Huawei-Cloud

Real-Time OCR WebApp (React, NodeJS, Python) demo on HUAWEI CLOUD

## Source Code


Serverless app using NodeJS, React and HUAWEI CLOUD (API Gateway, FunctionGraph, GaussDB, OBS), all the website will host in HUAWEI CLOUD OBS. 

## Architecture Desc
![Alt text](https://github.com/hexlicn/serverless-ocr-demo-on-Huawei-Cloud/blob/main/images/arch.png)

## How to demo

Please navigate to : https://www.hwcsa-domain.site/

![img](https://github.com/hexlicn/serverless-ocr-demo-on-Huawei-Cloud/blob/main/images/react-app-ocr.gif)

## How to prepare the development IDE and mandatory cloud service

1. First of all, install the required VSCode plugin: "Prettier - Code Formatter" and "Simple React Snippets".
2. Install nodejs on your devlopment laptop.
3. Create the nodejs project within VSCode by input command "npm i -g create-react-app", once done, just input command "create-react-app app", and finally execute "npm start".
4. Configure the basic frontend module, go to https://reactstrap.github.io, copy the NPM command (npm install --save reactstrap react react-dom) and run within your react app folder. Then search from https://npmjs.com, "dotenv", "base64-img", "react-moment", "react-file-base64".
5. Configure Huawei Cloud service for [object storage](https://support.huaweicloud.com/intl/en-us/qs-obs/obs_qs_0003.html), [api gateway](https://support.huaweicloud.com/intl/en-us/qs-apig/apig-ug-180307002.html), [FunctionGraph](https://support.huaweicloud.com/intl/en-us/qs-functiongraph/functiongraph_04_0101.html), [CDN](https://support.huaweicloud.com/intl/en-us/qs-cdn/cdn_01_0072.html), [OCR endpoint(Thailand ID card recognition)](https://support.huaweicloud.com/intl/en-us/api-ocr/ocr_03_0050.html), [Relational Database - MySQL](https://support.huaweicloud.com/intl/en-us/qs-rds/en-us_topic_0046585334.html), domain name and your SSL certificate.
6. Copy the source code here and overwrite to your VSCode IDE files;

## Contact Author

@WhatsApp: +27 726557778  
@Email:    lihexin1@huawei.com
