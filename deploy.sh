#!/bin/bash
# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Usage: ./deploy.sh [--test] [static_html_dir_path]

# Deploys custom authentication page static HTML files to Onezone container launched
# with one-env.
# Attention: it overwrites current custom front page on the container!

set -e
SCRIPT_DIR=`dirname -- "$0"`
source ${SCRIPT_DIR}/env.sh

if [ "$IS_TEST_MODE" == "true" ]; then
  USER_HTML_PATH=${2}
else
  USER_HTML_PATH=${1}
fi

if [ -z "${USER_HTML_PATH}" ]; then
  USER_HTML_PATH=examples/egi-datahub
fi

kubectl exec dev-onezone-0 -- mkdir -p ${CUSTOM_HTML_PATH}
kubectl exec dev-onezone-0 -- rm -rf ${TARGET_PATH}
echo "${USER_HTML_PATH} -> dev-onezone-0:${TARGET_PATH}"
kubectl cp ${USER_HTML_PATH} dev-onezone-0:${TARGET_PATH}
