#!/bin/bash
# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Usage: ./deploy.sh [static_html_dir_path]

# Deploys custom authentication page static HTML files to Onezone container launched
# with one-env.
# Attention: it overwrites current custom front page on the container!

set -e

USER_HTML_PATH=${1}

if [ -z "${USER_HTML_PATH}" ]; then
  USER_HTML_PATH=examples/egi-datahub
fi

CUSTOM_HTML_PATH=/var/www/html/oz_worker/custom
TARGET_PATH=${CUSTOM_HTML_PATH}/frontpage

kubectl exec dev-onezone-0 -- mkdir -p ${CUSTOM_HTML_PATH}
kubectl exec dev-onezone-0 -- rm -rf ${TARGET_PATH}
echo "${USER_HTML_PATH} -> dev-onezone-0:${TARGET_PATH}"
kubectl cp ${USER_HTML_PATH} dev-onezone-0:${TARGET_PATH}
