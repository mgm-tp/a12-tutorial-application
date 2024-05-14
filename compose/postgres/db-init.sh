#!/bin/bash

set -e
set -u

function create_user() {
  local user=$1 password=$2
	echo "  Creating user '$user'"
	psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
		  CREATE USER "$user" WITH PASSWORD '$password';
EOSQL
}

function create_database() {
	local user=$1 database=$2
	echo "Creating database $database for user $user"
	psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
	    CREATE DATABASE "$database";
	    GRANT ALL ON DATABASE "$database" TO "$user";
	    ALTER DATABASE "$database" OWNER TO "$user";
EOSQL
}

# Data Services
DATA_SERVICES_DB="${DATA_SERVICES_DB:-}"
DATA_SERVICES_USER="${DATA_SERVICES_USER:-}"
DATA_SERVICES_PASSWORD="${DATA_SERVICES_PASSWORD:-}"

if [[ -n "$DATA_SERVICES_DB" && -n "$DATA_SERVICES_USER" && -n "$DATA_SERVICES_PASSWORD" ]]; then
  create_user "$DATA_SERVICES_USER" "$DATA_SERVICES_PASSWORD"
  create_database "$DATA_SERVICES_USER" "$DATA_SERVICES_DB"
fi

# Content Store
CONTENT_STORE_DB="${CONTENT_STORE_DB:-}"
CONTENT_STORE_USER="${CONTENT_STORE_USER:-}"
CONTENT_STORE_PASSWORD="${CONTENT_STORE_PASSWORD:-}"

if [[ -n "$CONTENT_STORE_DB" && -n "$CONTENT_STORE_USER" && -n "$CONTENT_STORE_PASSWORD" ]]; then
    create_user "$CONTENT_STORE_USER" "$CONTENT_STORE_PASSWORD"
    create_database "$CONTENT_STORE_USER" "$CONTENT_STORE_DB"
fi
