# Db Writer

Refer to the [architecture diagram](../../README.md#architecture-diagram) to understand where this application is situated in the system.

## Run the application

To run this application, run `npm install` inside the `db-writer` folder, and then run `node app.js`.

## Summary

The Db Writer is subscribed to both the [accepted_prescriptions_queue](../../infra/README.md#exchanges--queues) and the [rejected_prescriptions_queue](../../infra/README.md#exchanges--queues).\
When it consumes a message (JSON prescription) from the accepted queue, the prescription gets inserted to the database.\
When it consumes a message (JSON prescription and set of violated rules) from the rejected queue, both the prescription and the violated rules get inserted into the database. These are linked by a foreign key.

## Sequence Diagrams

### Accepted Prescriptions

```mermaid
sequenceDiagram
    participant acceptedQueue as Accepted Prescriptions Queue
    participant dbWriter as Db Writer
    participant db as SQLite Database

    Note over dbWriter,acceptedQueue: The Db Writer is subscribed to<br>the Accepted Prescriptions Queue

    acceptedQueue->>+dbWriter: prescription JSON message

    dbWriter->>db: insert prescription and prescribed medication

    dbWriter--)-acceptedQueue: acknowledge
```

### Rejected Prescriptions

```mermaid
sequenceDiagram
    participant rejectedQueue as Rejected Prescriptions Queue
    participant dbWriter as Db Writer
    participant db as SQLite Database

    Note over dbWriter,rejectedQueue: The Db Writer is subscribed to<br>the Rejected Prescriptions Queue

    rejectedQueue->>+dbWriter: prescription JSON message and rule violations

    dbWriter->>db: insert prescription, prescribed medication and violated rules

    dbWriter--)-rejectedQueue: acknowledge
```
