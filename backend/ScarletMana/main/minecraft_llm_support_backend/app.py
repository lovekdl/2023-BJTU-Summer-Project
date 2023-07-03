# Made by YXH_XianYu
#      in 2023.5.9
#      for Worldline Project

"""
from flask import Flask, request, jsonify
from .mcllm_backend import McllmBackend

mcllm_backend = McllmBackend()

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    dataJson = request.json
    print(dataJson)

    username = dataJson["username"]
    type = dataJson["type"]
    target = dataJson["target"]
    message = dataJson["message"]

    response = mcllm_backend.query(username, target, message)
    
    resultJson = {
        "state": "success",
        "message": response
    }
    print(resultJson)
    return jsonify(resultJson)

@app.route('/reset', methods=['POST'])
def reset():
    print("resetting history")
    
    mcllm_backend.reset()
    
    resultJson = {
        "state": "success",
        "message": "reset success"
    }
    return jsonify(resultJson)


if __name__ == '__main__':
    app.run()
"""