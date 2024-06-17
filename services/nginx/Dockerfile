FROM debian:bookworm

RUN apt-get update && apt upgrade

RUN apt-get install \
    git jq gcc make build-essential autoconf \
    automake libtool libcurl4-openssl-dev \
    liblua5.3-dev libfuzzy-dev ssdeep gettext \
    pkg-config libgeoip-dev libyajl-dev \
    doxygen  libpcre3-dev libpcre2-16-0 \
    libpcre2-dev libpcre2-posix3 zlib1g \
    python3-launchpadlib wget curl\
    zlib1g-dev software-properties-common -y

COPY /conf/get_ssl.sh /tmp/get_ssl.sh
RUN chmod +x /tmp/get_ssl.sh
COPY /conf/.key /tmp/.key
RUN ./tmp/get_ssl.sh

RUN cd /opt && git clone https://github.com/owasp-modsecurity/ModSecurity.git \
    && cd ModSecurity \
    && git submodule init \
    && git submodule update \
    && ./build.sh \
    && ./configure \
    && make \
    && make install

RUN cd /opt && git clone https://github.com/owasp-modsecurity/ModSecurity-nginx.git
RUN add-apt-repository ppa:ondrej/nginx -y
RUN apt update && apt install nginx -y

RUN cd /opt && wget https://nginx.org/download/nginx-1.22.1.tar.gz \
    && tar -xvzf nginx-1.22.1.tar.gz

RUN cd /opt/nginx-1.22.1/ && ./configure --with-compat --add-dynamic-module=/opt/ModSecurity-nginx \
    && make \
    && make modules \
    && cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules-enabled/ \
    && cp /opt/ModSecurity/modsecurity.conf-recommended /etc/nginx/modsecurity.conf \
    && cp /opt/ModSecurity/unicode.mapping /etc/nginx/unicode.mapping

RUN echo "load_module /etc/nginx/modules-enabled/ngx_http_modsecurity_module.so;" > /tmp/tempfile && \
    cat /etc/nginx/nginx.conf >> /tmp/tempfile && \
    mv /tmp/tempfile /etc/nginx/nginx.conf

COPY /conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY /conf/modsecurity.conf /etc/nginx/modsecurity.conf

RUN git clone https://github.com/coreruleset/coreruleset.git /etc/nginx/owasp-crs

COPY /conf/modsecurity-crs.conf /etc/nginx/owasp-crs/crs-setup.conf

COPY ./frontend/ /usr/share/nginx/html/
CMD /tmp/get_ssl.sh && nginx -g "daemon off;"