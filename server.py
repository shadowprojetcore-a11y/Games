#!/usr/bin/env python3
"""Petit serveur local pour jouer a Mario 2D.
Usage : python3 server.py [port]   (port par defaut : 8000)
"""
import http.server
import socket
import sys
import webbrowser
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = Path(__file__).parent


def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler) as httpd:
        print("=" * 46)
        print("  MARIO 2D - serveur demarre !")
        print("=" * 46)
        print(f"  Sur ce PC      : http://localhost:{PORT}")
        print(f"  Sur le reseau  : http://{lan_ip()}:{PORT}")
        print("  (les autres appareils du meme Wi-Fi peuvent y jouer)")
        print("  Ctrl+C pour arreter")
        print("=" * 46)
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServeur arrete.")
