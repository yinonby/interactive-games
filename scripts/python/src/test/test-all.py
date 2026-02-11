#!/usr/bin/env python3
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from multiprocessing import cpu_count

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))

# ANSI Colors
GREEN = "\033[92m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def find_packages(root_dir):
    """Locates directories containing package.json or Makefile, skipping ignored dirs."""
    tasks = []
    for root, dirs, files in os.walk(root_dir):
        # Skip root dir
        if root == root_dir:
            continue

        # Skip node_modules and virtual environments
        if "node_modules" in root or ".venv" in root or ".git" in root:
            continue

        if "package.json" in files:
            tasks.append(
                {
                    "name": os.path.basename(root) or "root",
                    "cwd": root,
                    "cmd": ["npm", "test"],
                }
            )
        elif "Makefile" in files:
            # We only add if the Makefile actually has a 'test' target
            tasks.append(
                {
                    "name": os.path.basename(root) or "root",
                    "cwd": root,
                    "cmd": ["make", "test"],
                }
            )
    return tasks


def run_test(task):
    """Executes a single test command and captures output."""
    name = task["name"]
    print(f"{GREEN}Running tests on {name}...{RESET}")

    # Capture=True stores stdout/stderr so we can print it only on failure
    result = subprocess.run(
        task["cmd"], cwd=task["cwd"], capture_output=True, text=True
    )

    return {
        "name": name,
        "success": result.returncode == 0,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "code": result.returncode,
    }


def main():
    tasks = find_packages(ROOT_DIR)

    if not tasks:
        print("No testable packages found.")
        return

    # Use number of CPU cores as the worker limit
    max_workers = cpu_count()
    print(
        f"{BOLD}Starting parallel tests across {len(tasks)} packages ({max_workers} cores)...{RESET}\n"
    )

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_task = {executor.submit(run_test, t): t for t in tasks}

        try:
            for future in as_completed(future_to_task):
                res = future.result()

                if res["success"]:
                    # Append 'done' to the previous "Running..." line
                    # Note: In parallel, 'done' might appear on a new line if other logs started
                    print(f"{GREEN}Tests in {res['name']}... DONE{RESET}")
                else:
                    # Failure detected
                    print(f"\n{RED}{BOLD}FAILED: {res['name']}{RESET}")
                    print("-" * 40)
                    print(res["stdout"])
                    print(res["stderr"])
                    print("-" * 40)
                    print(
                        f"{RED}Tests failed in {res['name']}. Shutting down remaining tests...{RESET}"
                    )

                    # Shutdown the executor immediately
                    executor.shutdown(wait=False, cancel_futures=True)
                    sys.exit(1)

        except KeyboardInterrupt:
            executor.shutdown(wait=False, cancel_futures=True)
            print(f"\n{RED}Testing aborted by user.{RESET}")
            sys.exit(1)

    print(f"\n{GREEN}{BOLD}All tests passed successfully!{RESET}")


if __name__ == "__main__":
    main()
