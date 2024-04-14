import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import json
from openai import OpenAI

class RAG:
    def __init__(self, file_name):
        # Load the RAG model components
        self.client = OpenAI()
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
        context = '\n'.join(retrieved_chunks)
        messages.append({"role":"system", "content":context})
        messages.append({"role":"system", "content":"Please provide a short paraphrased answer to the user's response as well as a supporting quote from the above snippets of SOFI-2023."})

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                temperature=0.5,
                messages=messages
            )
            return {"content":response.choices[0].message.content, "role":response.choices[0].message.role}
        except Exception as e:
            print("Exception", e)
            return {"content":"OpenAI threw an error","role":"assistant"}