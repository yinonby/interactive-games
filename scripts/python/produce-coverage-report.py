#!/usr/bin/env python3

import sys
import shutil
import subprocess

from coverage_defs import MONOREPO_ROOT
from coverage_defs import ROOT_COVERAGE_DIR
from coverage_defs import REPORT_COVERAGE_OUTPUT_DIR
from coverage_defs import TMP_COVERAGE_OUTPUT

def check_nyc_installed():
  print("Verifying nyc exists...")

  # ---------------------------
  # Make sure nyc is installed
  # ---------------------------
  try:
    # Try to run `npx nyc --version` to see if it exists
    subprocess.run(["npx", "nyc", "--version"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
  except FileNotFoundError:
    # npx not found at all
    sys.exit("❌ npx is not installed. Please install Node.js and npx.")
  except subprocess.CalledProcessError:
    # npx found but nyc not installed
    sys.exit("❌ NYC is not installed. Please install it with `npm install --save-dev nyc`.")

def setup_tmp_coverage():
  print("Setting up report input...")

  # ---------------------------
  # Clear or create root .coverage_output
  # ---------------------------
  if ROOT_COVERAGE_DIR.exists():
    shutil.rmtree(ROOT_COVERAGE_DIR)
  ROOT_COVERAGE_DIR.mkdir(parents=True, exist_ok=True)

  # ---------------------------
  # Find all coverage-final.json files in packages/apps
  # ---------------------------
  for coverage_file in MONOREPO_ROOT.glob("**/.coverage_output/coverage-final.json"):
    # The package name is the parent folder's parent (package root)
    package_root = coverage_file.parent.parent
    package_name = package_root.name

    dest_file = ROOT_COVERAGE_DIR / f"{package_name}-coverage.json"
    shutil.copy2(coverage_file, dest_file)

def create_report():
  print("Creating report...")

  # ---------------------------
  # Ensure report output dir exists
  # ---------------------------
  if REPORT_COVERAGE_OUTPUT_DIR.exists():
    shutil.rmtree(REPORT_COVERAGE_OUTPUT_DIR)
  REPORT_COVERAGE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

  # ---------------------------
  # Run nyc report
  # ---------------------------
  cmd = [
    "npx",
    "nyc",
    "report",
    "--exclude",
    "**/*.spec.ts",
    "--reporter",
    "html",
    f"--temp-dir={TMP_COVERAGE_OUTPUT}",
    f"--report-dir={REPORT_COVERAGE_OUTPUT_DIR}",
  ]

  subprocess.run(cmd, check=True, cwd=MONOREPO_ROOT)
  index_file = REPORT_COVERAGE_OUTPUT_DIR / "index.html"
  print(f"Coverage report generated at {index_file}")

check_nyc_installed()
setup_tmp_coverage()
create_report()
