
# Utilisation de l'image officielle de Prometheus à partir du hub Docker
FROM grafana/grafana:6.2.5

# Copie du fichier de configuration Prometheus local dans le conteneur
# COPY	grafana-data /var/lib/grafana

# RUN chown root:root /etc/grafana
# RUN cat /etc/grafana/grafana.ini

USER root
RUN chown -R grafana:grafana /etc/grafana
USER grafana

COPY	datasource.yml /etc/grafana/provisioning/datasources/datasource.yml
COPY	dashboards.yml /etc/grafana/provisioning/dashboards/dashboards.yml
COPY	grafana.ini /etc/grafana/grafana.ini
# COPY	./monitoringGrafana/dashboards /var/lib/grafana/dashboards 



# Exposition du port de Prometheusmak

# Commande par défaut à exécuter lorsque le conteneur démarre
# Vous pouvez personnaliser cette commande en fonction de vos besoins
# CMD ["--config.file=/etc/prometheus/prometheus.yml"]
