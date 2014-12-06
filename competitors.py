__author__ = '212391398'


#{
#    "competitors": [
#        {
#            "firstname": "Dat",
#            "lastname": "Nguyen",
#            "sex": 0,
#            "belt": 0,
#            "academy": "GF Team",
#            "matches": 0,
#            "wins": 0,
#            "submissions": 0,
#            "rating": 0
#        }
#    ]
#}

from flask import Flask
app = Flask(__name__)

@app.route('/competitors')
def hello_world():
    with open("competitors.json") as fin:
        ret = fin.read()
        return ret

if __name__ == '__main__':
    app.run()