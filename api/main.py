from flask import Flask, request, jsonify
from google.cloud import firestore

db = firestore.Client()

app = Flask(__name__)

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
    if not user_trail.get().exists:
        # verify username exists
        return jsonify({"error": "The username can't be found"}), 400

    if len(content) != 2:
        return jsonify({"error": "Invalid JSON data"}), 400

    clean_dict = dict()

    i = 10
    
    while i > 0:
        if 'q' + str(i) in content:
            break
        i-=1
    
    if i == 0:
        return jsonify({"error": "No question specified"}), 400

    if content['q' + str(i)] > 3 or content['q' + str(i)] < -1:
        return jsonify({"error": "Invalid value for POSTed key(s)"}), 400

    for j in range(i+1, 11):
        clean_dict['q' + str(j)] = -1
    
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
        content['password'] = content.get('password', None)
        entity.set(content)
        trail_entity.set({'q1': 0})
        
        return jsonify({"message": "success"}), 200
    else:
        return jsonify({"error": "Missing one or more properties"}), 400

if __name__ == '__main__':
    app.run()
