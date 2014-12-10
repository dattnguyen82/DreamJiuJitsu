__author__ = '212391398'

import random
import compute
import os

from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/competitors')
def list():
    with open("competitors.json") as fin:
        ret = fin.read()
        return ret

@app.route('/calculate')
def calculate():
    c1Str = request.args.get('c1')
    c2Str = request.args.get('c2')
    matchStr = request.args.get('match')

    c1 = int(c1Str)
    c2 = int(c2Str)
    match = float(matchStr)

    #match = 1
    #c1 = 1583
    #c2 = 1572

    results = compute.calculate_elo_rank(c1, c2, match)

    ret = "Current Competitor 1: " + str(c1) + "<br>"
    ret += "Current Competitor 2: " + str(c2) + "<br>"
    ret += "Match: " + str(match) + "<br>"
    ret += "New Competitor 1 rank: " + str(results[0]) + "<br>"
    ret += "New Competitor 2 rank: " + str(results[1]) + "<br>"

    return ret

if __name__ == '__main__':
    app.run()