import json

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/message', methods=['POST'])
def message():
    message_history = request.json['message_history']

    return jsonify(response=f"LLM response to [{message_history[-1]['content']}] here")


app.run(debug=True)
