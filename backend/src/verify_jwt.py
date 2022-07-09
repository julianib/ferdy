from google.oauth2 import id_token
from google.auth.transport import requests

from convenience import *


# source https://developers.google.com/identity/sign-in/web/backend-auth

# todo verification takes 100-200ms, use other greenlet? eventlet.spawn
def verify(token_id: str, raise_if_invalid: bool) -> Optional[dict]:
    try:
        Log.debug("Verifying JWT")
        id_info = id_token.verify_oauth2_token(token_id, requests.Request(),
                                               CLIENT_ID)
        time.sleep(10)

        Log.debug(f"Verified JWT OK")
        return id_info

    except ValueError:
        Log.debug(f"JWT was invalid")

        if raise_if_invalid:
            raise InvalidJWT
