#!/bin/sh

helm uninstall nginx-ingress
helm upgrade --install nginx-ingress ingress-nginx/ingress-nginx
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml