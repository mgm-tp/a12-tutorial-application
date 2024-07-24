#!/bin/bash

set -e
set -u

function create_user_if_not_exists() {
  local user=$1 password=$2
	echo "  Creating user '$user'"
	psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
		DO
		\$do\$
		BEGIN
		IF EXISTS (
			SELECT FROM pg_catalog.pg_roles
			WHERE  rolname = '$user') THEN
			RAISE NOTICE 'Role "$user" already exists. Skipping.';
		ELSE
		  	CREATE USER "$user" WITH PASSWORD '$password';
		END IF;
		END
		\$do\$;
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
DATASERVICES_DB="${DATASERVICES_DB:-}"
DATASERVICES_USER="${DATASERVICES_USER:-}"
DATASERVICES_PASSWORD="${DATASERVICES_PASSWORD:-}"

if [[ -n "$DATASERVICES_DB" && -n "$DATASERVICES_USER" && -n "$DATASERVICES_PASSWORD" ]]; then
  create_user_if_not_exists "$DATASERVICES_USER" "$DATASERVICES_PASSWORD"
  create_database "$DATASERVICES_USER" "$DATASERVICES_DB"
fi

# Content Store
CONTENTSTORE_DB="${CONTENTSTORE_DB:-}"
CONTENTSTORE_USER="${CONTENTSTORE_USER:-}"
CONTENTSTORE_PASSWORD="${CONTENTSTORE_PASSWORD:-}"

if [[ -n "$CONTENTSTORE_DB" && -n "$CONTENTSTORE_USER" && -n "$CONTENTSTORE_PASSWORD" ]]; then
    create_user_if_not_exists "$CONTENTSTORE_USER" "$CONTENTSTORE_PASSWORD"
    create_database "$CONTENTSTORE_USER" "$CONTENTSTORE_DB"
fi
