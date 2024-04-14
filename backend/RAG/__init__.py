import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import json
import openai

class RAG:
    def __init__(self, model_name="facebook/rag-token-nq"):
        # Load the RAG model components
        with open('config.json', 'r') as config_file:
            config = json.load(config_file)
        openai.api_key = config.get('openai_api_key')
        # NLTK resource download
        nltk.download('punkt')
        self.vectorizer = TfidfVectorizer()

    def preprocess_document(self, doc_path):
        with open(doc_path, 'r', encoding='utf-8') as file:
            document_text = file.read()
        return sent_tokenize(document_text)

    def retrieve_context(self, question, context_chunks, top_k=5):
        context_vectors = self.vectorizer.fit_transform(context_chunks)
        question_vector = self.vectorizer.transform([question])
        similarities = cosine_similarity(question_vector, context_vectors).flatten()
        top_indices = similarities.argsort()[-top_k:][::-1]
        return [context_chunks[i] for i in top_indices]

    def generate_answer(self, messages, context_chunks):
        retrieved_chunks = self.retrieve_context(messages[-1], context_chunks)
        context = ' '.join(retrieved_chunks)
        messages.append({"role":"system", "content":context})
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages
            )
            return response.choices[0].message['content']
        except Exception as e:
            return str(e)