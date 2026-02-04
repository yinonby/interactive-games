
CUR_SCRIPT_DIR=$(realpath $(dirname -- "${BASH_SOURCE[0]}"))
COMMON_SCRIPTS_DIR="${CUR_SCRIPT_DIR}/../../../bash"

. $COMMON_SCRIPTS_DIR/common.sh

[[ -f $HOME/.local/bin/poetry ]] || echo_err_exit "Failed, poetry not installed"

# get poetry in path
PATH=$PATH:$HOME/.local/bin

pushd $CUR_SCRIPT_DIR >/dev/null

echo_green "Run all services in dev mode..."
poetry run ./start-all-dev.py || echo_err_exit "Failed to run all services in dev mode"

popd >/dev/null
