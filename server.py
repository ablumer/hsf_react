import json
import os
import time
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/api/tradestays', methods=['GET', 'POST'])
def tradestays_handler():

    with open('data.json', 'r') as file:
        tradestays = json.loads(file.read())

    if request.method == 'POST':
        newEstablishment = request.form.to_dict()
        newEstablishment['id'] = int(time.time() * 1000)
        tradestays.append(newEstablishment)

        with open('data.json', 'w') as file:
            file.write(json.dumps(tradestays, indent=4, separators=(',', ': ')))

    return Response(json.dumps(tradestays), mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT",3000)))
