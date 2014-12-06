__author__ = '212391398'

import random
import os
import string

TAG_COMPETITORS='"competitors"'
TAG_ID='"id"'
TAG_FIRSTNAME='"firstname"'
TAG_LASTNAME='"lastname"'
TAG_SEX='"sex"'
TAG_BELT='"belt"'
TAG_ACADEMY='"academy"'
TAG_MATCHES='"matches"'
TAG_WINS='"wins"'
TAG_SUBMISSIONS='"submissions"'
TAG_RATING='"rating"'


def generate_name(size=12, chars=string.ascii_uppercase):
    return ''.join(random.choice(chars) for _ in range(size))

filename = 'competitors.json'

output = '{' + os.linesep

output += TAG_COMPETITORS + ':[' + os.linesep

count = 100
for i in range(0, count):
    firstname = generate_name()
    lastname = generate_name()
    sex = random.randrange(0,2)
    belt = random.randrange(0,5)
    academy = generate_name()
    matches = random.randrange(1, 101)
    wins = random.randrange(0, matches)
    submissions = random.randrange(0, wins+1)
    rating = random.randrange(0, 1000)
    id = i
    output += '{' + os.linesep


    output += TAG_ID + ':' + str(id) + ',' + os.linesep
    output += TAG_FIRSTNAME + ':"' + str(firstname) + '",' + os.linesep
    output += TAG_LASTNAME + ':"' + str(lastname) + '",' + os.linesep
    output += TAG_SEX + ':' + str(sex) + ',' + os.linesep
    output += TAG_BELT + ':' + str(belt) + ',' + os.linesep
    output += TAG_ACADEMY + ':"' + str(academy) + '",' + os.linesep
    output += TAG_MATCHES + ':' + str(matches) + ',' + os.linesep
    output += TAG_WINS + ':' + str(wins) + "," + os.linesep
    output += TAG_SUBMISSIONS + ':' + str(submissions) + ',' + os.linesep
    output += TAG_RATING + ':' + str(rating)  + os.linesep
    output += "}"
    if i < count-1:
        output += ","

output += "]" + os.linesep + "}" + os.linesep

print output

with open(filename, 'w+') as f:
    f.write(output)
