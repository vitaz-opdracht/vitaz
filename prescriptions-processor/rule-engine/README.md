# Rule Engine

Refer to the [architecture diagram](../../README.md#architecture-diagram) to understand where this application is situated in the system.

## Run the application

To run this application, run `npm install` inside the `rule-engine` folder, and then run `node prescription-processor.js`.

## Summary

The Rule Engine uses [amqplib](https://www.npmjs.com/package/amqplib) to communicate with RabbitMQ over AMQP, [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) to communicate with the database, and [moment](https://www.npmjs.com/package/moment) to parse dates.

### Rules
The Rule Engine fetches information about the order of the enabled activation rules from the database, and caches the result. To prevent the cache from getting stale, this is done every minute.

### Flow

The Rule Engine is subscribed to the [raw_prescriptions_queue](../../infra/README.md#exchanges--queues).
When it consumes a message (JSON prescription) from this queue, it validates the prescription against the cached set of rules.
Valid prescriptions are sent to the prescription_exchange with a routing key of 'accepted', whilst invalid prescriptions and their rule violations are sent to the prescription_exchange with a routing key of 'rejected'.

## Sequence Diagrams

### Rules Cache
```mermaid
sequenceDiagram
    participant ruleEngine as Rule Engine
    participant db as SQLite Database

    loop poll every minute
        ruleEngine->>+db: get rules
        db--)-ruleEngine: rules
    end
```

### General Flow

```mermaid
sequenceDiagram
    participant rawQueue as Raw Prescriptions Queue
    participant ruleEngine as Rule Engine
    participant exchange as Prescriptions Exchange

    Note over ruleEngine,rawQueue: The Rule Engine is subscribed to<br>the Raw Prescriptions Queue

    rawQueue->>+ruleEngine: prescription JSON message

    ruleEngine->>ruleEngine: validate prescription against<br>cached rules

    alt prescription is valid
        ruleEngine->>+exchange: add prescription JSON message, routing key 'accepted'
    else prescription is invalid
        ruleEngine->>exchange: add prescription JSON message + rule violations, routing key 'rejected'
    end
    exchange--)-ruleEngine: acknowledge

    ruleEngine--)-rawQueue: acknowledge
```
