#!/usr/bin/env python3
import os
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
    RESET = "\033[0m"

# Color mapping for the prefixes themselves
COLORS = {
    "EXP": color.BLUE,
    "API": color.GREEN,
    "WSS": color.PURPLE,
    "PRX": color.CYAN,
    "RESET": color.RESET,
}

SYSTEM_MSG_PREFIX = f"[{color.YELLOW}SYS{color.RESET}]"

APPS = [
    {
        "name": "API",
        "cwd": "apps/ig-api",
        "cmd": ["npm", "run", "start:dev:presets:all"],
        "ready_msg": "Server is running at",
    },
    {
        "name": "EXP",
        "cwd": "apps/ig-expo",
        "cmd": ["npm", "start"],
        "ready_msg": "Logs for your project will appear below",
    },
    {
        "name": "WSS",
        "cwd": "python/apps/ig-ws",
        "cmd": ["make", "run"],
        "ready_msg": "WebSocket server listening on",
    },
    {
        "name": "PRX",
        "cwd": "apps/ig-dev-http-proxy",
        "cmd": ["npm", "start"],
        "ready_msg": "Dev http proxy is running",
    },
]


def stream_logs_pipe(pipe, prefix, ready_msg, ready_event):
    color = COLORS.get(prefix, COLORS["RESET"])
    try:
        for line in pipe:
            sys.stdout.write(f"{color}[{prefix}]{COLORS['RESET']} {line}")
            sys.stdout.flush()
            if ready_msg and ready_msg in line:
                ready_event.set()  # signal ready
    except Exception:
        pass


def run():
    # Setup root path relative to script location
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
    processes = []

    try:
        for app in APPS:
            print(f"{SYSTEM_MSG_PREFIX} Launching {app['name']}...")

            proc = subprocess.Popen(
                app["cmd"],
                cwd=os.path.join(root_dir, app["cwd"]),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
            )

            proc.app_name = app["name"]
            processes.append(proc)

            ready_msg = app["ready_msg"]
            ready_event = threading.Event()
            t = threading.Thread(
                target=stream_logs_pipe,
                args=(proc.stdout, app["name"], ready_msg, ready_event),
                daemon=True,
            )
            t.start()

            if ready_msg:
                ready_event.wait()
                print(
                    f"{SYSTEM_MSG_PREFIX} {app['name']} is ready, can launch next apps"
                )

        while True:
            for proc in processes:
                exit_code = proc.poll()
                if exit_code is not None:
                    print(
                        f"\n{SYSTEM_MSG_PREFIX} {proc.app_name} failed (Code: {exit_code}). Exiting..."
                    )
                    return
            time.sleep(0.5)

    except KeyboardInterrupt:
        print(f"\n{SYSTEM_MSG_PREFIX} User requested shutdown.")
    finally:
        for proc in processes:
            if proc.poll() is None:
                proc.terminate()

if __name__ == "__main__":
    run()
