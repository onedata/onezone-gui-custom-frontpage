# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Do not launch this as a script separately - it is a file for sourcing common environment
# variables for other scripts in this project.

set -e

IS_TEST_MODE=false

if [ "$1" == "--test" ]; then
  IS_TEST_MODE=true
fi

if [ "$IS_TEST_MODE" == "true" ]; then
  FRONTPAGE_DIR="frontpage-test"
else
  FRONTPAGE_DIR="frontpage"
fi

CUSTOM_HTML_PATH=/var/www/html/oz_worker/custom
TARGET_PATH=${CUSTOM_HTML_PATH}/${FRONTPAGE_DIR}
