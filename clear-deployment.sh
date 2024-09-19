#!/bin/bash
# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Usage: ./clear-deployment.sh

# Removes custom front page files from Onezone container.

set -e

CUSTOM_HTML_PATH=/var/www/html/oz_worker/custom
TARGET_PATH=${CUSTOM_HTML_PATH}/frontpage

kubectl exec dev-onezone-0 -- rm -rf ${TARGET_PATH}
