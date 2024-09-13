#!/bin/bash

docker run -it --rm -v `pwd`:/onedata-gui-custom-frontpage -p 8080:8080 --entrypoint="/onedata-gui-custom-frontpage/entrypoint.sh" onedata-gui-custom-frontpage:v1 $@