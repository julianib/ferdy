from google.oauth2 import id_token
from google.auth.transport import requests

from convenience import *


# todo verification takes 100-200ms, use other greenlet: eventlet.spawn

# source https://developers.google.com/identity/sign-in/web/backend-auth

def verify(token_id: str, raise_if_invalid: bool) -> Optional[dict]:
    try:
        Log.debug("Verifying google token id")
        id_info = id_token.verify_oauth2_token(token_id, requests.Request(),
                                               CLIENT_ID)

        Log.debug(f"Verified google token id OK")
        return id_info

    except ValueError:
        Log.debug(f"Google token id was invalid")

        if raise_if_invalid:
            raise JWTInvalid
