"""
Redirect insecure HTTP requests
"""

from http.server import HTTPServer, BaseHTTPRequestHandler


DESTINATION = "https://doferdydurke.nl"


# from https://stackoverflow.com/a/47084250/13216113
class RequestRedirect(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(301)
        self.send_header("Location", DESTINATION)
        self.end_headers()
        address = self.client_address[0]
        print(f"Redirected someone, {address=}")


def redirect_loop():
    print(f"Redirecting http traffic to {DESTINATION}")
    HTTPServer(("", 80), RequestRedirect).serve_forever()


def main():
    redirect_loop()


if __name__ == "__main__":
    main()
