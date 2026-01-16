#!/usr/bin/env python3

from coverage_defs import REPORT_COVERAGE_OUTPUT_DIR
import webbrowser

def open_report():
  index_file = REPORT_COVERAGE_OUTPUT_DIR / "index.html"
  print(f"Opening report from {index_file}")

  # ---------------------------
  # Open index.html in browser
  # ---------------------------
  webbrowser.open(f"file://{index_file}")

open_report()
