#!/bin/sh

set -e

REPO_PATH=/onezone-gui-custom-frontpage
PORT=8080
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
# FIXME: get files from GitHub, remove unsafe -k flag
# curl -kL "https://dev-onezone.default.svc.cluster.local/ozw/onezone/assets/scripts/custom-frontpage-integration.js" > scripts/custom-frontpage-integration.js
# curl -kL "https://dev-onezone.default.svc.cluster.local/ozw/onezone/assets/styles/custom-frontpage.css" > styles/custom-frontpage.css
curl -L "https://www.dropbox.com/scl/fi/1k3dzhvna7btldvpb0g4d/custom-frontpage-integration.js?rlkey=6l4gpwtk18l6udggk5euuhc3s&dl=0" > scripts/custom-frontpage-integration.js
curl -L "https://www.dropbox.com/scl/fi/h97v10yyg293d1qbfh7kc/custom-frontpage.css?rlkey=xypg1ybx4ygpnh9yqzrndfta6&dl=0" > styles/custom-frontpage.css


# Mount custom frontpage for development
mkdir -p ${SITE_PATH}/ozw/onezone/custom
cd ${SITE_PATH}/ozw/onezone/custom
ln -s ${HTML_PATH} frontpage

# Start web server for displaying the app with frontpage
cd ${SITE_PATH}
echo ""
echo "--------------------------------------------------------------------"
echo "Open the mock app: http://localhost:${PORT}/ozw/onezone/index.html"
echo "--------------------------------------------------------------------"
echo ""
http-server -p ${PORT} ${SITE_PATH}
