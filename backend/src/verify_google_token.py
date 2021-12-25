from google.oauth2 import id_token
from google.auth.transport import requests

from convenience import *


# source https://developers.google.com/identity/sign-in/web/backend-auth

def verify(token_id: str):
    try:
        Log.debug("Verifying google token id")
        start_time = time.time()
        id_info = id_token.verify_oauth2_token(token_id, requests.Request(),
                                               CLIENT_ID)
        elapsed = time.time() - start_time

        Log.debug(f"Verified token OK, {elapsed=}, {id_info=}", cutoff=False)
        return id_info

    except ValueError:
        Log.debug("Google token id was invalid")
        return
