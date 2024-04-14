from flask import Flask, request, jsonify
from RAG import RAG

app = Flask(__name__)
rag = RAG("SOFI-2023.txt")

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/message', methods=['POST'])
def message():
    message_history = request.json['message_history']

    rag.generate_answer(messages=message_history)

    return jsonify(response=f"LLM response to [{message_history[-1]['content']}] here")


app.run()
