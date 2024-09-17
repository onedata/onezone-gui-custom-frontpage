#!/bin/bash
# Author: Jakub Liput
# Copyright (C) 2024 ACK CYFRONET AGH
# This software is released under the MIT license cited in 'LICENSE.txt'

# Usage: ./run.sh [static_html_dir_path]

# Starts development server for creating custom Onezone GUI authentication page.
# See README.md for more information.

docker run -it --rm -v `pwd`:/onedata-gui-custom-frontpage -p 8080:8080 --entrypoint="/onedata-gui-custom-frontpage/entrypoint.sh" onedata-gui-custom-frontpage:v1 $@