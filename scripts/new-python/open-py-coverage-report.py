#!/usr/bin/env python3

import webbrowser

from coverage_defs import OUTPUT_DIR


def open_report():
    index_file = OUTPUT_DIR + "/index.html"
    print(f"Opening report from {index_file}")

    # ---------------------------
    # Open index.html in browser
    # ---------------------------
    webbrowser.open(f"file://{index_file}")

open_report()
