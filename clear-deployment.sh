#!/bin/bash
# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Usage: ./clear-deployment.sh [--test]

# Removes custom front page files from Onezone container.

set -e
SCRIPT_DIR=`dirname -- "$0"`
source ${SCRIPT_DIR}/env.sh

echo Removing dev-onezone-0:$TARGET_PATH
kubectl exec dev-onezone-0 -- rm -rf ${TARGET_PATH}
