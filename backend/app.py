from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('api/message', methods=['POST'])
def message():
    prompt = request.json['prompt']

    return jsonify(response=f"LLM response to [{prompt}] here")


app.run()
