
import os

# -----------------------------
# CONFIG
# -----------------------------
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../python"))
OUTPUT_DIR = os.path.expanduser("~/temp/ig-py-coverage")
MERGED_COVERAGE_FILE = os.path.join(OUTPUT_DIR, ".py_coverage_merged")
