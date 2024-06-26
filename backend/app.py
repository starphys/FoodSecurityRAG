from flask import Flask, request, jsonify

from dotenv import load_dotenv
load_dotenv()

from RAG import RAG

rag = RAG('SOFI-2023.txt')

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/message', methods=['POST'])
def message():
    message_history = request.json['message_history']

    response = rag.generate_answer(message_history)

    return jsonify(response=response)


app.run(debug=True)
