#! /usr/bin/env bash
DB=medco
PORT=5432
USER=`whoami`
PASS=$USER

sudo -u postgres psql -p $PORT -c "drop database if exists $DB";
sudo -u postgres psql -p $PORT -c "drop user if exists $USER";
sudo -u postgres psql -p $PORT -c "create database $DB";
sudo -u postgres psql -p $PORT -c "create user $USER with password '$PASS'";
sudo -u postgres psql -p $PORT -c "grant ALL privileges on database $DB to $USER";
sudo -u postgres psql -p $PORT -d $DB -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"';
sudo -u postgres psql -p $PORT -d $DB -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto"';
sudo -u postgres psql -p $PORT -d $DB -c 'CREATE EXTENSION IF NOT EXISTS "hstore"';