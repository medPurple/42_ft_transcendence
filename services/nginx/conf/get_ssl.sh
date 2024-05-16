#!/bin/sh

data=$(curl -H "X-Vault-Token: $(cat /tmp/.key)" http://vault:8200/v1/kv/nginx | jq -r '.data'| sed 's/\\n/\\\\n/g')
echo $data

ssl_certificate=$(echo $data | jq -r '.ssl_certificate')
ssl_certificate_key=$(echo $data | jq -r '.ssl_certificate_key')

echo "$ssl_certificate" > /tmp/ssl.crt
echo "$ssl_certificate_key" > /tmp/ssl.key