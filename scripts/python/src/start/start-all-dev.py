#!/usr/bin/env python3
import os
import pty
import subprocess
import sys
import threading
import time


class color:
    PURPLE = "\033[95m"
    CYAN = "\033[96m"
    DARKCYAN = "\033[36m"
    BLUE = "\033[94m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    END = "\033[0m"

# Color mapping for the prefixes themselves
COLORS = {
    "EXP": color.BLUE,
    "API": color.GREEN,
    "WSS": color.PURPLE,
    "PRX": color.CYAN,
    "RESET": "\033[0m",
}

APPS = [
    {"name": "EXP", "cwd": "apps/ig-expo", "cmd": ["npm", "start"]},
    {"name": "API", "cwd": "apps/ig-api", "cmd": ["npm", "run", "start:dev:presets:all"]},
    {"name": "WSS", "cwd": "python/apps/ig-ws", "cmd": ["make", "run"]},
    {"name": "PRX", "cwd": "apps/ig-dev-http-proxy", "cmd": ["npm", "start"]},
]

def stream_logs(fd, prefix):
    """Reads from the pseudo-terminal file descriptor."""
    color = COLORS.get(prefix, COLORS["RESET"])
    try:
        while True:
            data = os.read(fd, 1024)
            if not data:
                break
            # Split lines to ensure prefix is added to every newline
            lines = data.decode(errors='replace').splitlines(keepends=True)
            for line in lines:
                sys.stdout.write(f"{color}[{prefix}]{COLORS['RESET']} {line}")
                sys.stdout.flush()
    except OSError:
        pass # File descriptor closed

def run():
    # Setup root path relative to script location
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
    processes = []

    try:
        for app in APPS:
            print(f"[\033[1mSYSTEM\033[0m] Launching {app['name']}...")

            # Create a pseudo-terminal to preserve ANSI colors
            master_fd, slave_fd = pty.openpty()

            proc = subprocess.Popen(
                app["cmd"],
                cwd=os.path.join(root_dir, app["cwd"]),
                stdout=slave_fd,
                stderr=slave_fd,
                close_fds=True,
            )
            proc.app_name = app["name"]
            processes.append(proc)

            # Close slave in parent, start log thread using master
            os.close(slave_fd)
            t = threading.Thread(target=stream_logs, args=(master_fd, app["name"]), daemon=True)
            t.start()

        while True:
            for proc in processes:
                exit_code = proc.poll()
                if exit_code is not None:
                    print(f"\n[\033[91mSYSTEM\033[0m] {proc.app_name} failed (Code: {exit_code}). Exiting...")
                    return
            time.sleep(0.5)

    except KeyboardInterrupt:
        print("\n[SYSTEM] User requested shutdown.")
    finally:
        for proc in processes:
            if proc.poll() is None:
                proc.terminate()

if __name__ == "__main__":
    run()
