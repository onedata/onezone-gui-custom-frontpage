all:
	docker build . -t onedata-gui-custom-frontpage:v1

run:
	./run.sh