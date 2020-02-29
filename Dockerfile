FROM alpine:3.10

# Install packages
RUN apk --no-cache add php7 php7-fpm php7-pdo php7-pdo_mysql php7-json php7-openssl php7-curl \
    php7-zlib php7-xml php7-phar php7-intl php7-dom php7-xmlreader php7-ctype \
    php7-mbstring php7-gd php7-session php7-tokenizer php7-bcmath php7-fileinfo \
    php7-xmlwriter nginx supervisor curl vim nano bash

# Add composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure nginx
COPY conf.d/nginx.conf /etc/nginx/nginx.conf

# Configure PHP-FPM
COPY conf.d/fpm-pool.conf /etc/php7/php-fpm.d/www.conf
COPY conf.d/php.ini /etc/php7/conf.d/zzz_custom.ini

# Configure supervisord
COPY conf.d/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Make sure files/folders needed by the processes are accessable when they run under the nobody user
RUN chown -R nobody.nobody /run && \
  chown -R nobody.nobody /var/lib/nginx && \
  chown -R nobody.nobody /var/tmp/nginx && \
  chown -R nobody.nobody /var/log/nginx

# Setup document root
RUN mkdir -p /var/www/html

# Make the document root a volume
VOLUME /var/www/html

# Switch to use a non-root user from here on
USER nobody

# Add application
WORKDIR /var/www/html

# Expose the port nginx is reachable on
EXPOSE 8080

# Let supervisord start nginx & php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Configure a healthcheck to validate that everything is up&running
HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1/fpm-ping