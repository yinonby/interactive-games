#!/usr/bin/env python3

import os
import subprocess
import sys

# ANSI color codes
GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"

ROOT_DIR = os.getcwd()

class TestFailureError(Exception):
    """Raised when npm tests fail in a package."""
    pass

def run_all_npm_tests():
  for current_dir, dirnames, filenames in os.walk(ROOT_DIR):
    # Exclude node_modules from traversal
    dirnames[:] = [d for d in dirnames if d != "node_modules"]

    # Skip the root directory itself
    if current_dir == ROOT_DIR:
      continue

    if "package.json" in filenames:
      try:
        run_npm_test(current_dir)

      except TestFailureError:
        sys.exit(1)

def run_npm_test(package_dir):
  print(f"\n{GREEN}▶ Running tests in: {package_dir}{RESET}")

  result = subprocess.run(
    ["npm", "test"],
    cwd=package_dir,
    check=False # don't crash on failure
  )

  if result.returncode != 0:
    print(f"{RED}✖ Tests failed in {package_dir}{RESET}")
    raise TestFailureError(f"Tests failed in {package_dir}")

def run_all_python_tests():
    python_folder = os.path.join(ROOT_DIR, "python")

    for current_dir, dirnames, filenames in os.walk(python_folder):
        # Skip .venv, __pycache__, or other unwanted directories
        dirnames[:] = [d for d in dirnames if d not in [".venv", "__pycache__"]]

        # Search for the "test-py-pkg.sh" file
        if "Makefile" in filenames:
            run_python_test(current_dir)

def run_python_test(package_dir):
    print(f"\n{GREEN}▶ Running python tests in: {package_dir}{RESET}")

    # Run the test script
    result = subprocess.run(
        ["make", "test"],
        cwd=package_dir,
        check=False  # don't crash on failure
    )

    if result.returncode != 0:
        print(f"{RED}✖ Tests failed in {package_dir}{RESET}")
        sys.exit(1)

run_all_python_tests()
run_all_npm_tests()
