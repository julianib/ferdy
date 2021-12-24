"""
Redirect insecure HTTP requests
"""

from datetime import datetime
import errno
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import signal
import socket

REDIRECT_PORT = 80
DESTINATION = "https://doferdydurke.nl"


# from https://stackoverflow.com/a/47084250/13216113
class RequestRedirect(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(301)
        self.send_header("Location", DESTINATION)
        self.end_headers()

        address = self.client_address[0]
        now = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        print(f"[{now}] Redirected client, {address=}")


def redirect_loop():
    print(f"Redirecting http traffic to: {DESTINATION}")
    HTTPServer(("", REDIRECT_PORT), RequestRedirect).serve_forever()


def main():
    redirect_loop()


if __name__ == "__main__":
    main()
