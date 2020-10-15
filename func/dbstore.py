# -*- coding:utf-8 -*-
import pymysql
import json
import base64

print('Loading function')

def handler (event, context):
    
    req_body = json.loads(base64.b64decode(event['body']))

    # Connect to the database
    connection = pymysql.connect(host='192.168.0.71',
                                user='ocr_usr',
                                password='<your_mysql_password>',
                                db='ocr_store',
                                charset='utf8mb4',
                                cursorclass=pymysql.cursors.DictCursor)

    try:
        with connection.cursor() as cursor:
            # Create a new record
            sql = "INSERT INTO `id_card_tbl` (`idno`, `fname`, `birthday`, `addr`, `isdate`, `expdate`) VALUES (%s,%s,%s,%s,%s,%s)"
            cursor.execute(sql,(req_body['idcardno'], req_body['fullname'], req_body['birthday'], req_body['address'], req_body['issuedate'], req_body['expiredate']))

        # connection is not autocommit by default. So you must commit to save your changes.
        connection.commit()

        with connection.cursor() as cursor:
            # Scan table
            sql = "SELECT `idno`, `fname`, `birthday`, `addr`, `isdate`, `expdate` FROM `id_card_tbl`"
            cursor.execute(sql)
            result = cursor.fetchone()
            print(result)
    finally:
        connection.close()
        
    return {
        "statusCode": 200,
        "isBase64Encoded": False,
        "headers":{},
        "body": json.dumps(event)
        }
