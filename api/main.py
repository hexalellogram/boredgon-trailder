from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import firestore
from hashlib import sha256

db = firestore.Client()

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/match/<string:username>')
def match(username):
    trail_ref = db.collection('oregon_trail').document(username)
    trail_entity = trail_ref.get()
    if not trail_entity.exists:
        return jsonify({"error": "Username not found"})
    
    trail_dict = trail_entity.to_dict()
    trail_coll = db.collection('oregon_trail')

    matches = trail_coll.where(
            "q1", '==', trail_dict['q1']).where(
            "q2", '==', trail_dict['q2']).where(
            "q3", '==', trail_dict['q3']).where(
            "q4", '==', trail_dict['q4']).where(
            "q5", '==', trail_dict['q5']).where(
            "q6", '==', trail_dict['q6']).where(
            "q7", '==', trail_dict['q7']).where(
            "q8", '==', trail_dict['q8']).where(
            "q9", '==', trail_dict['q9']).where(
            "q10", '==', trail_dict['q10'])

    resps = matches.get()
    if not resps:
        return jsonify({"users": []}), 200
    
    name_discord = list()
    for match in resps:
        print(match.id)
        match_username = match.id
        if match_username == username:
            continue
        match_dict = db.collection('oregon_users').document(match_username).get().to_dict()
        name_discord.append({match_dict['name']: match_dict['discord']})

    return jsonify({"users": name_discord}), 200


@app.route('/trail', methods=["POST"])
def trail():
    content = request.get_json()
    if content is None:
        return jsonify({"error": "Please POST a valid JSON with the correct content type"}), 400
    if 'username' not in content:
        return jsonify({"error": "Missing username"}), 400

    username = content['username']
    user_trail = db.collection('oregon_users').document(username)
    user_trail_doc = user_trail.get()
    if not user_trail_doc.exists:
        # verify username exists
        return jsonify({"error": "The username or password is incorrect"}), 400
    
    if 'password' not in content:
        return jsonify({"error": "Missing password"}), 400

    hashedPw = sha256(content['password'].encode('utf-8')).hexdigest()
    if hashedPw != user_trail_doc.to_dict()['password']:
        return jsonify({"error": "The username or password is incorrect"}), 400

    if len(content) != 3:
        return jsonify({"error": "Invalid JSON data"}), 400

    clean_dict = dict()

    i = 10
    
    while i > 0:
        if 'q' + str(i) in content:
            break
        i-=1
    
    if i == 0:
        return jsonify({"error": "No question specified"}), 400

    if content['q' + str(i)] > 5 or content['q' + str(i)] < -1:
        return jsonify({"error": "Invalid value for POSTed key(s)"}), 400

    for j in range(i+1, 11):
        clean_dict['q' + str(j)] = 0
    
    clean_dict['q' + str(i)] = content['q' + str(i)]

    if len(clean_dict) == 0:
        return jsonify({"error": "Missing one or more properties"}), 400

    doc_ref = db.collection('oregon_trail').document(username)
    doc_dict = doc_ref.get().to_dict()
    for j in range(1, i):
        if 'q' + str(j) in doc_dict:
            if doc_dict['q' + str(j)] == -1:
                return jsonify({"error": "You died during question " + str(j)}), 400
            elif doc_dict['q' + str(j)] == 0:
                return jsonify({"error": "You need to answer question {} first".format(j)}), 400
    doc_ref.update(clean_dict)

    return jsonify({"message": "success"}), 200
            

@app.route('/user', methods=["POST"])
def add_user():
    content = request.get_json()
    if content is None:
        return jsonify({"error": "Please POST a valid JSON with the correct content type"}), 400
    if len(content) == 2:
        if ('username' in content and "password" in content):
            # Handle login
            entity = db.collection('oregon_users').document(content['username'])
            entity_obj = entity.get()
            if entity_obj.exists:
                if entity_obj.to_dict()['password'] == sha256(content['password'].encode('utf-8')).hexdigest():
                    doc_ref = db.collection('oregon_trail').document(content['username'])
                    doc_dict = doc_ref.get().to_dict()
                    for j in range(1, 11):
                        if 'q' + str(j) in doc_dict:
                            if doc_dict['q' + str(j)] == -1:
                                return jsonify({"message": "Logged in", "question": 'Ending'}), 200
                            elif doc_dict['q' + str(j)] == 0:
                                return jsonify({"message": "Logged in", "question": 'q' + j}), 200
                            
                            if j == 10:
                                return jsonify({"message": "Logged in", "question": 'Ending'}), 200
                    # Login
                # Not login
                return jsonify({"error": "The username or password is incorrect"}), 400
            else:
                return jsonify({"error": "The username or password is incorrect"}), 400
        else:
            return jsonify({"error": "Missing one or more properties"}), 400
    if (
        'username' in content
        and 'bio' in content
        and 'discord' in content
        and 'name' in content
        and 'pfp' in content
    ):
        entity = db.collection('oregon_users').document(content['username'])
        if entity.get().exists:
        #if len(resp) != 0:
            # verify username is unique
            return jsonify({"error": "The given username already exists"}), 400
        # put the profile in the db
        entity = db.collection('oregon_users').document(content['username'])
        trail_entity = db.collection('oregon_trail').document(content['username'])
        del content['username']
        raw_pass = content.get('password', None)
        hashedPw = None
        if raw_pass:
            hashedPw = sha256(raw_pass.encode('utf-8')).hexdigest()
            
        content['password'] = hashedPw
        entity.set(content)
        trail_entity.set({'q1': 0})
        
        return jsonify({"message": "success"}), 200
    else:
        return jsonify({"error": "Missing one or more properties"}), 400

if __name__ == '__main__':
    app.run()
