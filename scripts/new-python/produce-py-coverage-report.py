#!/usr/bin/env python3
"""
Merge Python coverage data from multiple packages and generate a single HTML report.
"""

import os
import sys

from coverage import Coverage
from coverage_defs import MERGED_COVERAGE_FILE, OUTPUT_DIR, ROOT_DIR

# -----------------------------
# Ensure output directory exists
# -----------------------------
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------
# Find all .py_coverage files
# -----------------------------
coverage_files = []
for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
    # skip virtual environments and caches
    dirnames[:] = [d for d in dirnames if d not in (".venv", "__pycache__")]
    if ".py_coverage" in filenames:
        coverage_files.append(os.path.join(dirpath, ".py_coverage"))

if not coverage_files:
    print(f"No .py_coverage files found under {ROOT_DIR}")
    sys.exit(1)

print("Found coverage files:")
for f in coverage_files:
    print(f" - {f}")

# -----------------------------
# Merge coverage files
# -----------------------------
cov = Coverage(data_file=MERGED_COVERAGE_FILE)
cov.combine(data_paths=coverage_files, keep=True)
cov.save()
print(f"Merged coverage saved to {MERGED_COVERAGE_FILE}")

# -----------------------------
# Generate HTML report
# -----------------------------
cov.html_report(directory=OUTPUT_DIR)
print(f"HTML coverage report generated at {OUTPUT_DIR}/index.html")
