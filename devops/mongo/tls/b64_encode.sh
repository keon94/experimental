#!/bin/sh

printf "\n\n============Certificate============\n\n"

#cat MyCertificate.crt | tail -n +2 | head -n -1 | base64 | tr -d '\r'| tr -d '\n'
cat $1 | base64 | tr -d '\r'| tr -d '\n' | dos2unix | tee b64-cert.crt

printf "\n\n============Key============\n\n"

#cat MyKey.key | tail -n +2 | head -n -1 | base64 | tr -d '\r'| tr -d '\n'
cat $2 | base64 | tr -d '\r'| tr -d '\n' | dos2unix | tee b64-key.key
