
import getpass
from pathlib import Path

MONOREPO_ROOT = Path(__file__).resolve().parent.parent.parent  # adjust if script is in monorepo root
ROOT_COVERAGE_DIR = MONOREPO_ROOT / ".coverage_output"  # new folder at root
USER_HOME = Path(f"/Users/{getpass.getuser()}")
REPORT_COVERAGE_OUTPUT_DIR = USER_HOME / "temp/ig-coverage"  # HTML output here
TMP_COVERAGE_OUTPUT = ROOT_COVERAGE_DIR  # temp dir for nyc
