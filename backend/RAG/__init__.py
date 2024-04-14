import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import json
import openai

class RAG:
    def __init__(self, file_name):
        # Load the RAG model components
        with open('RAG/config.json', 'r') as config_file:
            config = json.load(config_file)
        openai.api_key = config.get('openai_api_key')
        # NLTK resource download
        nltk.download('punkt')
        self.vectorizer = TfidfVectorizer()

        self.document_chunks = self.preprocess_document(file_name)

    def preprocess_document(self, doc_path):
        with open(doc_path, 'r', encoding='utf-8') as file:
            document_text = file.read()
        return sent_tokenize(document_text)

    def retrieve_context(self, question, top_k=5):
        context_vectors = self.vectorizer.fit_transform(self.document_chunks)
        question_vector = self.vectorizer.transform([question])
        similarities = cosine_similarity(question_vector, context_vectors).flatten()
        top_indices = similarities.argsort()[-top_k:][::-1]
        return [self.document_chunks[i] for i in top_indices]

    def generate_answer(self, messages):
        retrieved_chunks = self.retrieve_context(messages[-1]["content"])
        context = ' '.join(retrieved_chunks)
        messages.append({"role":"system", "content":context})
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                temperature=0,
                messages=messages
            )
            return response.choices[0].message
        except Exception as e:
            return str(e)