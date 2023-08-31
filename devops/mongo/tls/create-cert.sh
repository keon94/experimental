#!/bin/bash

cd "$(dirname "$0")"

openssl_cnf=/etc/ssl/openssl.cnf
if [ ! -f $openssl_cnf ] || [ "$(uname)" != Linux ]; then
  openssl_cnf=/mingw64/etc/ssl/openssl.cnf
fi

#https://stackoverflow.com/questions/43665243/invalid-self-signed-ssl-cert-subject-alternative-name-missing/56530824#56530824
openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out ca.crt -keyout ca.key \
  -subj "//CN=mongo-express.com" \
  -addext "subjectAltName=DNS:mongo-express.com" \
  -addext "basicConstraints=critical,CA:FALSE"

if [ $? != 0 ]; then
  exit 1
fi
./b64_encode.sh ca.crt ca.key