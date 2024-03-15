
import asyncio
import websockets
import json
from deep_translator import GoogleTranslator
# import logging
# logger = logging.getLogger('websockets')
# logger.setLevel(logging.DEBUG)
# logger.addHandler(logging.StreamHandler())
address = "0.0.0.0"
port = 5001
# 受信コールバック
async def server(websocket, path):
    try:
        while True:  # クライアントからのメッセージを継続的に受信するための無限ループ
            # 受信
            received_packet = await asyncio.wait_for(websocket.recv(),timeout=180)
            res = json.loads(received_packet)
            print(res["en"])
            # 翻訳
            translated = GoogleTranslator(source='auto', target='ja').translate(res["en"])

            res['jp'] = translated
            packet = json.dumps(res)
            # 送信
            await websocket.send(packet)
    except websockets.ConnectionClosed:
        print("Connection Closed")
    except Exception as e:
        print(f"予期せぬエラーが発生しました: {e}")
start_server = websockets.serve(server, address, port)
# サーバー立ち上げ
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()




# from flask import Flask
# from deep_translator import GoogleTranslator
# import websockets
# import asyncio
# import json
# address = "127.0.0.1"
# port = 5001


# async def server(websocket, path):
#     # 受信
#     received_packet = await websocket.recv()
#     dictionary = json.loads(received_packet.decode())
#     print("{}: {}".format(path, dictionary))
#     # 送信
#     dictionary['message'] = 'Message from Server'
#     dictionary['bool'] = False
#     packet = json.dumps(dictionary).encode()
#     await websocket.send(packet)
# start_server = websockets.serve(server, address, port)
# # サーバー立ち上げ
# asyncio.get_event_loop().run_until_complete(start_server)
# print(address)

# asyncio.get_event_loop().run_forever()


# app = Flask(__name__)

# @app.route("/<word>", methods=["GET"])
# def index(word):
#     name = await websocket.recv()

#     translated = GoogleTranslator(source='auto',target='ja').translate(word)

#     return translated

