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
