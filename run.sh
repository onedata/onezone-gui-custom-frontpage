#!/bin/bash
# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Usage: ./run.sh [static_html_dir_path]

# Starts development server for creating custom Onezone GUI authentication page.
# See README.md for more information.

REPO_PATH=/onezone-gui-custom-frontpage
IMAGE_NAME=onedata/onezone-gui-custom-frontpage:v1
PORT=8080

docker run --network="host" -it --rm -v `pwd`:${REPO_PATH} --expose ${PORT} -p ${PORT}:${PORT} --entrypoint="${REPO_PATH}/entrypoint.sh" ${IMAGE_NAME} $@