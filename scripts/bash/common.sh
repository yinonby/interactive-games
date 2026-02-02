
function isMac {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    return 0
  else
    return 1
  fi
}

function echo_green {
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  echo -e "${GREEN}$@${NC}"
}

function echo_red {
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  echo -e "${RED}$@${NC}"
}

function echo_err_exit {
  echo_red "$@" 1>&2
  exit 1
}

function echo_err_return_1 {
  echo_red "$@" 1>&2
  return 1
}

function echo_log {
  echo "$@"
}

function echo_log_green {
  echo_green "$@"
}

function echo_log_red {
  echo_red "$@"
}

if isMac; then
  BASE_CONF_DIR="/etc/defaults"
  BASE_SSL_CERTS_DIR="/etc/ssl/certs"
  VAR_DIR=/opt/homebrew/var
else
  BASE_CONF_DIR="/etc/default"
  BASE_SSL_CERTS_DIR="/etc/ssl/certs"
  VAR_DIR=/var
fi

function placeFileInOutDirIfNotExist {
  local filepath=$1
  local outDir=$2
  local user=$3
  local group=$4

  local filename=$(basename $filepath)

  if [ -f "$outDir/$filename" ]; then
    echo_log "*******"
    echo_log "File already exists, not overriding"
    echo_log "*******"
  else
    mkdir -p "$outDir" || return 1
    cp "$filepath" "$outDir" || return 1
    echo_log "Copied $filename to $outDir"

    # chown "$user:$group" "$outDir/$filename" || return 1
  fi
}

function getDeviceIpLinux {
  local deviceName=$1; shift

  ip -f inet addr show $deviceName | awk '/inet / {print $2}' | awk -F "/" '{print $1}' \
    || echo_err_return_1 "Failed to get device ip" || return 1
}

function installPackage {
  local packageName=$1; shift

  if isMac; then
    installPackageOnMac ${packageName} || return 1
  else
    installPackageOnUbuntu ${packageName} || return 1
  fi
}

function installPackageOnMac {
  local packageName=$1; shift

  if brew list ${packageName} >/dev/null 2>&1; then
    echo_log "${packageName} already installed, nothing to do"
    return 0
  fi

  echo_log "installing ${packageName}..."
  brew install ${packageName} || echo_err_return_1 "Failed to install ${packageName}" || return 1
}

function installPackageOnUbuntu {
  local packageName=$1; shift

  if apt list --installed 2>/dev/null | grep -wq ${packageName} >/dev/null; then
    echo_log "${packageName} already installed, nothing to do"
    return 0
  fi

  echo_log "installing ${packageName}..."
  sudo apt update || echo_err_return_1 "Failed to update apt" || return 1
  sudo apt install -y ${packageName} || echo_err_return_1 "Failed to install ${packageName}" || return 1
  sudo apt upgrade -y ${packageName} || echo_err_return_1 "Failed to upgrade ${packageName}" || return 1
}

function installNodejs {
  local nodeVersion=$1; shift

  [ -f $HOME/.nvm/nvm.sh ] || curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

  source "$HOME/.nvm/nvm.sh"

  nvm ls ${nodeVersion} >/dev/null || nvm install ${nodeVersion}

  [ $(nvm current) == ${nodeVersion} ] || nvm use ${nodeVersion}
}

function startService {
  local serviceName=$1; shift

  echo_log "Starting ${serviceName}..."
  if isMac; then
    brew services start ${serviceName} || echo_err_return_1 "Failed to start ${serviceName}" || return 1
  else
    sudo systemctl start ${serviceName} || echo_err_return_1 "Failed to start ${serviceName}" || return 1
    sudo systemctl enable ${serviceName} || echo_err_return_1 "Failed to enable ${serviceName}" || return 1
  fi
}

function stopService {
  local serviceName=$1; shift

  echo_log "Stopping ${serviceName}..."
  if isMac; then
    brew services stop ${serviceName} || echo_err_return_1 "Failed to stop ${serviceName}" || return 1
  else
    sudo systemctl stop ${serviceName} || echo_err_return_1 "Failed to stop ${serviceName}" || return 1
  fi
}

function replaceStrInFile {
  local srcStr=$1; shift
  local dstStr=$1; shift
  local filePath=$1; shift

  BCK=
  if isMac; then
    BCK=".bak"
  fi
  sed -i $BCK "s|$srcStr|$dstStr|g" ${filePath} \
    || echo_err_return_1 "Failed to replace [$srcStr] with [$dstStr] in [$filePath]" || return 1
}

function addSelfToEtcHostIfNeeded {
  local hostname=$1; shift
  local deviceName=$1; shift

  echo_log "Checking whether need to add self to hosts file"

  if ! grep -wq ${hostname} /etc/hosts; then
    local ipAddr=$(getDeviceIpLinux ${deviceName}) || return 1

    echo_log "Adding self to hosts file, ${hostname} ${ipAddr}"

    addToEtcHostIfNeeded ${hostname} ${ipAddr} || return 1
  fi
}

function addEtcHostIfNeeded {
  local hostname=$1; shift
  local ipAddr=$1; shift

  if ! grep -wq ${hostname} /etc/hosts; then
    echo_log "Adding host to /etc/hosts, ${hostname}, ${ipAddr}"
    echo_log "${ipAddr} ${hostname}" | sudo tee -a /etc/hosts >/dev/null
  else
    echo_log "Host already exists in /etc/hosts, ${hostname}"
  fi
}

function updateEtcHostsWithMultipleHostsStr {
  local hostAndIpsStr=$1; shift # format: <hostname-1>::<ip-1>,<hostname-2>::<ip-2>,...,<hostname-n>::<ip-n>

  echo_log "Updating host file for [${hostAndIpsStr}]"

  local hostAndIpsArr=($(awk -F "," '{$1=$1} 1' <<<"${hostAndIpsStr}"))

  for hostAndIp in "${hostAndIpsArr[@]}"
  do
    updateEtcHostsWithSingleHostsStr $hostAndIp
  done
}

function updateEtcHostsWithSingleHostsStr {
  local hostAndIpStr=$1; shift # format: <hostname>::<ip>

  local hostName=$(echo_log $hostAndIpStr | awk -F "::" '{print $1}')
  local hostIp=$(echo_log $hostAndIpStr | awk -F "::" '{print $2}')

  echo_log "Updating host file for hostName [${hostName}], hostIp [${hostIp}]"

  addEtcHostIfNeeded $hostName $hostIp
}

function cloneGitRepo {
  local nodeEnv=$1; shift
  local baseGitDir=$1; shift
  local gitRepo=$1; shift
  local gitBranchOrCommit=$1; shift
  local skipNpmInstall=$1; shift

  local gitRepoName=$(echo_log "${gitRepo}" | awk -F "/" '{ print $2 }' | awk -F "." '{ print $1 }')
  local gitDir=${baseGitDir}/${gitRepoName}

  # create base git dir
  rm -rf ${baseGitDir} || return 1
  mkdir -p ${baseGitDir} || return 1

  # TODO: try figure out how to use ssh-config, currently not working

  # update known_hosts so that git-clone is not interactive
  touch ~/.ssh/known_hosts
  if [ ! -n "$(grep "^github.com " ~/.ssh/known_hosts)" ]; then
    ssh-keyscan github.com >> ~/.ssh/known_hosts
  fi

  # clone tp git
  echo_log "Cloning git repo..."
  git clone --recurse-submodules ${gitRepo} ${gitDir} || return 1

  # update cif git submodule
  pushd ${gitDir} >/dev/null || return 1

  echo_log "Running git checkout ${gitBranchOrCommit} ..."
  git checkout ${gitBranchOrCommit} || return 1

  echo_log "Updating CIF submodule..."
  git submodule update --init --recursive || return 1

  ${skipNpmInstall} || installNpmPackages $nodeEnv || return 1

  popd >/dev/null
}

function updateGitRepo {
  local nodeEnv=$1; shift
  local gitDir=$1; shift

  echo_log "Updating git repository, gitDir [${gitDir}]"

  ! isGitDirty ${gitDir} || echo_err_return_1 "git has local changes, quitting" || return 1

  pushd ${gitDir} >/dev/null || return 1

  git pull --recurse-submodules >/dev/null || return 1

  installNpmPackages $nodeEnv || return 1

  popd >/dev/null
}

function installNpmPackages {
  local nodeEnv=$1; shift

  echo_log "Installing npm packages..."
  local npmInstallArgs=
  [[ nodeEnv == "production" ]] && npmInstallArgs="--production"
  npm install $npmInstallArgs || return 1
}

function isGitDirty {
  local gitDir=$1; shift

  pushd ${gitDir} >/dev/null || return 1
  ! git diff --quiet
  ret=$?
  popd >/dev/null

  return $ret
}
