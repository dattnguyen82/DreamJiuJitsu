__author__ = '212391398'

import random
import math

sub = 1.5
win = 1.0
draw = 0.5
lose = 0.0

MATCH_OUTCOMES = [-sub, -win, draw, win, sub]

def map_outcome(outcome):
    result = [0, 0]
    if outcome == 0.5:
        result[0] = result[1] = outcome
    if outcome < 0:
        result[1] = outcome * -1.0
    else:
        result[0] = outcome
    return result

def calculate_elo_rank(rank1, rank2, match_result):
    weight = 15
    result = [rank1, rank2]

    outres = map_outcome(match_result)

    expectedWin1 = 1.0 / (1 + 10**((rank2 - rank1) / 400.0))
    expectedWin2 = 1.0 / (1 + 10**((rank1 - rank2) / 400.0))

    result[0] = math.ceil(rank1 + weight * (outres[0] - expectedWin1))
    result[1] = math.ceil(rank2 + weight * (outres[1] - expectedWin2))

    return result

#rankA = 1583
#rankB = 1572

#o = MATCH_OUTCOMES[random.randrange(0,5)]

#results = calculate_elo_rank(rankA, rankB, o)

#print o
#print results[0]
#print results[1]