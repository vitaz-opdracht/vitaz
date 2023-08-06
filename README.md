# Vitaz App

#### Table of Contents
1. [Quickstart](#quickstart)
2. [Infrastructure](#infrastructure)
3. [Applications](#applications)
4. [Summary](#summary)
5. [Architecture Diagram](#architecture-diagram)

## Quickstart

To start the system:
1. run `docker-compose up` in the `vitaz/infra` folder to start the [infrastructure](infra/README.md) 
2. run `docker-compose up` in the `vitaz/prescriptions-processor` folder to start the [Prescription Processor](prescriptions-processor/README.md) processes

Now the current and future JSON prescription files in the `vitaz/prescriptions` folder get inserted into the database.

To view the web dashboard:
1. run `docker-compose up` in the `vitaz/site` folder to start the [Angular + NestJS Web App](site/README.md)
2. browse to http://localhost

## Infrastructure

This project make use of the following infrastructure:
1. RabbitMQ message broker
2. A PostgreSQL database

View the [infra README file](infra/README.md) to set up the message broker and database using one command: `docker-compose up`.

## Applications

This project contains multiple applications. Each has their own README file.
1. [Directory Reader](prescriptions-processor/directory-reader/README.md)
2. [Rule Engine](prescriptions-processor/rule-engine/README.md)
3. [Db Writer](prescriptions-processor/db-writer/README.md)
4. [Angular front-end](site/README.md)
5. [NestJS back-end](site/README.md)

## Summary

Short summary of the architecture:
1. The Directory Reader watches the prescriptions folder for new files. It sends the content of JSON prescriptions files to the prescriptions_exchange with a routing key of 'raw'. This application additionally features a tiny HTTP server on which it exposes some statistics.
2. The Rule Engine is subscribed to the raw_prescriptions_queue. When it consumes a message (JSON prescription), it validates the prescription against the rules it retrieved from the database (cached, refreshed every minute). Valid prescriptions are sent to the prescription_exchange with a routing key of 'accepted', whilst invalid prescriptions and their rule violations are sent to the prescription_exchange with a routing key of 'rejected'.
3. The Db Writer is subscribed to both the accepted_prescriptions_queue and the rejected_prescriptions_queue. The relevant data of the messages it consumes is written to the database.
4. The NestJS back-end reads and writes to the database.
5. The Angular web application uses the NestJS back-end to show the user a dashboard and some tables, and allows the user to change the validation order of rules and enable/disable them.

The various applications' README files contain sequence diagrams for the application flow.

## Architecture Diagram

The above process is visualized in an architecture diagram:

![Architecture Diagram](https://i.imgur.com/0gNOvjS.png)
