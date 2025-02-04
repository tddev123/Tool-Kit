#!/bin/bash
# install-python.sh
curl -L https://github.com/indygreg/python-build-standalone/releases/download/20230726/cpython-3.9.16+20230726-x86_64-unknown-linux-gnu-install_only.tar.gz -o python.tar.gz
tar -xzf python.tar.gz
ln -s $(pwd)/python/bin/python3 $(pwd)/python/bin/python
export PATH="$PATH:$(pwd)/python/bin"