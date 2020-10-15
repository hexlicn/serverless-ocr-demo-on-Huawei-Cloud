# -*- coding:utf-8 -*-
import json
from HWOcrClientAKSK import HWOcrClientAKSK
import sys
import os
import base64

reload(sys)
sys.setdefaultencoding('utf8')

def handler (event, context):
    filePath = event["body"]
    if event["isBase64Encoded"]:
        filePath = base64.b64decode(event["body"])
    filePath = filePath.strip('"')
    print(filePath)

    region = "ap-southeast-2"
    ak = "<input_your_ak>"
    sk = "<input_your_sk>"
    imagePath = "https://react-ap-webapp-images.obs.ap-southeast-2.myhuaweicloud.com/" + filePath
    option = {}
    
    # Initialize ocr_client
    ocr_client = HWOcrClientAKSK(ak, sk, region)  
    response = recognizeIdCard(ocr_client, imagePath, option)
    statusCode = 500
    extractVal = {}
    if response:
        statusCode = response.status_code
        if response.status_code == 200:
        # convert String to Json
            jsonVariable = json.loads(response.text)
            if jsonVariable.has_key("result"): 
                extractVal = {
                    "idcard_no" : jsonVariable["result"]["id_number"],
                    "full_name_th" : jsonVariable["result"]["name_th"],
                    "birthday_th" : jsonVariable["result"]["date_of_birth_th"],
                    "addr_th" : jsonVariable["result"]["address_th"],
                    "issue_date_th" : jsonVariable["result"]["date_of_issue_th"],
                    "expired_date_th" : jsonVariable["result"]["date_of_expiry_th"]
                }
    jsonResponse = {
        'statusCode': statusCode,
        'isBase64Encoded': True,
        'headers': {
            "Content-type": "application/json"
        },
        'body': base64.b64encode(json.dumps(extractVal)),
    }
    print(json.dumps(extractVal))
    return json.dumps(jsonResponse)

def recognizeIdCard(ocrClient, imgPath, option):
    try:
        reqUri = "/v1.0/thailand-id-card"
        response = ocrClient.request_ocr_service_base64(reqUri, imgPath, option)  # Call OCR API to recognize image
        # print("Status code:" + str(response.status_code) + "\ncontent:" + response.text)
        return response

    except ValueError as e:
        print(e)

