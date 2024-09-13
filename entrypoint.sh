#!/bin/sh

set -e

REPO_PATH=/onedata-gui-custom-frontpage
SITE_PATH=/site

USER_HTML_PATH=$1

if [ -z "${USER_HTML_PATH}" ]; then
  USER_HTML_PATH=examples/egi-datahub
fi

HTML_PATH=${REPO_PATH}/${USER_HTML_PATH}

# Check if path with custom frontpage exists
ls ${HTML_PATH} > /dev/null

# Install Onezone mock webapp
mkdir -p ${SITE_PATH}/ozw
cp -r ${REPO_PATH}/mock-app ${SITE_PATH}/ozw/onezone
mkdir ${SITE_PATH}/ozw/onezone/assets
cd ${SITE_PATH}/ozw/onezone/assets
mkdir scripts
mkdir styles
# FIXME: get files from GitHub
curl -L "https://www.dropbox.com/scl/fi/5dd3ogq7oac79z70kx1bv/custom-frontpage-integration.js?rlkey=jck7wkr3by9h2ayc8m6tqk0eo&st=k00n6ak4&dl=0" > scripts/custom-frontpage-integration.js
curl -L "https://www.dropbox.com/scl/fi/bxwem0s2q1525mhjcigro/custom-frontpage.css?rlkey=dce8dv8lzxvgkkgcwuwoodxsd&st=up2k5cs6&dl=0" > styles/custom-frontpage.css

# Mount custom frontpage for development
mkdir -p ${SITE_PATH}/ozw/onezone/custom
cd ${SITE_PATH}/ozw/onezone/custom
ln -s ${HTML_PATH} frontpage

# Start web server for displaying the app with frontpage
cd ${SITE_PATH}
echo ""
echo "+-----------------------------------------------------------------+"
echo "| Open the mock app: http://localhost:8080/ozw/onezone/index.html |"
echo "+-----------------------------------------------------------------+"
echo ""
http-server -p 8080 ${SITE_PATH}
