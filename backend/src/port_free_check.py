from convenience import *


def check(port):
    Log.debug(f"Checking if port {port} is free")

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("localhost", port))
            Log.debug(f"Port {port} is free")
        except socket.error as ex:
            raise ex
