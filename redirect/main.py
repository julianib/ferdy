"""
Redirect insecure HTTP requests
"""

from datetime import datetime
import errno
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import signal
import socket


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
    HTTPServer(("", 80), RequestRedirect).serve_forever()


def main():
    # set the cwd to script location
    abspath = os.path.abspath(__file__)
    dirname = os.path.dirname(abspath)
    os.chdir(dirname)

    # check if port is in use
    # source: https://stackoverflow.com/a/35387673/13216113
    print("Checking if port 80 is free")
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("localhost", 80))
        except socket.error as ex:
            # if the port is in use, get and kill the process bound to it
            if ex.errno == errno.EADDRINUSE:
                print("Port 80 is in use, attempting to kill stored pid")
                
                # TODO if file doesn't exist, notify the pid couldn't be killed
                with open(".pid.txt", "r") as f:
                    bound_pid = int(f.readline())

                os.kill(bound_pid, signal.SIGKILL)
                print("Killed pid bound to port 80")
            
            else:
                raise

    # log the pid of current process
    pid = str(os.getpid())
    with open(".pid.txt", "w") as f:
        f.write(pid)

    print("Stored pid in .pid.txt")

    redirect_loop()


if __name__ == "__main__":
    main()
