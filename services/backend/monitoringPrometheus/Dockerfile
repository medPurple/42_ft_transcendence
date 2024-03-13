# Utilisation de l'image officielle de Prometheus à partir du hub Docker
FROM prom/prometheus:v2.11.1

# Copie du fichier de configuration Prometheus local dans le conteneur
# COPY 

# Exposition du port de Prometheus
EXPOSE 8080

# Commande par défaut à exécuter lorsque le conteneur démarre
# Vous pouvez personnaliser cette commande en fonction de vos besoins
CMD ["--config.file=/etc/prometheus/prometheus.yml"]