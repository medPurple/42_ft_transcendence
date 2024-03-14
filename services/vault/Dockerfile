FROM debian:latest
# Expose le port Vault
EXPOSE 8200

RUN apt update -y
RUN apt install -y gpg wget lsb-release
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --yes --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
RUN gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
RUN apt update && apt install vault
RUN export VAULT_ADDR='http://127.0.0.1:8200'


CMD ["sleep", "infinity"]