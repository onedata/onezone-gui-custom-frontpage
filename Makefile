.PHONY: docker

IMAGE_NAME=onedata/onezone-gui-custom-frontpage:v1

docker:
	docker build . -t ${IMAGE_NAME}
