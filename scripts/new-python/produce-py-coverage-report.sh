
CUR_SCRIPT_DIR=$(realpath $(dirname -- "${BASH_SOURCE[0]}"))
COMMON_SCRIPTS_DIR="${CUR_SCRIPT_DIR}/../bash"

. $COMMON_SCRIPTS_DIR/common.sh

[[ -f $HOME/.local/bin/poetry ]] || echo_err_exit "Failed, poetry not installed"

# get poetry in path
PATH=$PATH:$HOME/.local/bin

pushd $CUR_SCRIPT_DIR >/dev/null

echo_green "Install dependencies..."
poetry install --with dev || echo_err_exit "Failed to install dev env"

echo_green "Activate env..."
poetry env activate || echo_err_exit "Failed to activate env"

echo_green "Run Ruff format..."
poetry run ./produce-py-coverage-report.py || echo_err_exit "Failed to create report"

popd >/dev/null
