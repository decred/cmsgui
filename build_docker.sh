#!/bin/bash -e

# Setup
rm -rf docker-build
mkdir docker-build

# Build cmsgui
docker build . \
	-f ./Dockerfile-build \
	-t decred/cmsgui-build

docker run --rm \
	-v $(pwd)/docker-build:/root/build \
	decred/cmsgui-build:latest

# Build docker image to serve cmsgui
docker build . \
	-f ./Dockerfile-serve \
	-t decred/cmsgui-serve

echo ""
echo "==================="
echo "  Build complete"
echo "==================="
echo ""
echo "You can now run cmsgui with the following command:"
echo "    docker run -d --rm -p <local port>:80 decred/cmsgui-serve:latest"
echo ""

# Cleanup
rm -rf docker-build
