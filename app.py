from flask import Flask, render_template

from datetime import datetime, timedelta
from os import environ
from payloads import PAYLOADS
import jwt  # pip install pyjwt

app = Flask(__name__, static_url_path='/static') 


# Load available database connections
BASE_URL = "https://embed.chartio.com"
EXPIRES = 300 # seconds to expire jwt tokens
ORGANIZATION_SECRET = environ.get('EMBED_SECRET')

def get_embed_url(slug):
    payload = PAYLOADS[slug]
    payload['exp'] = datetime.utcnow() + timedelta(seconds=EXPIRES)
    # print("payload is", payload)
    url = '{0}/d{1}'.format(BASE_URL, slug)
    # print("url is", url)
    token = jwt.encode(payload, ORGANIZATION_SECRET)
    return "{0}?embed_token={1}".format(url, token.decode('utf-8'))

@app.route('/')
@app.route('/<org>/<dashboard>/')
def embed(org='the-how-we-feel-project', dashboard='state-dashboard'):
    slug = '/{}/{}/'
    try:
        embed_url = get_embed_url(slug.format(org, dashboard))
    except:
        embed_url = ""
    return render_template('index.html', embed_url=embed_url)