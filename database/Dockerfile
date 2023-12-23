FROM postgres:15.1-alpine

COPY ./initDocker/init.sql /docker-entrypoint-initdb.d/
RUN chown -R postgres:postgres /docker-entrypoint-initdb.d/

EXPOSE 5432
