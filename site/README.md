# Web App

#### Table of Contents

1. [Quickstart](#quickstart)
2. [Summary](#summary)

## Quickstart

Run `docker-compose up` inside the `vitaz/site` folder.

Navigate to http://localhost

## Summary

The web app uses [Angular](client/README.md) for the front-end, and [NestJS](server/README.md) for the back-end.

To start the front-end and the back-end, go to their respective folders and for both run the following commands sequentially:
1. `npm install`
2. `npm run start`

The Angular application starts listening on port 4200, the NestJS application on port 3000.\
To use the application, navigate to http://localhost:4200.

#### Table of Contents
1. [The dashboard page](#dashboard)
   1. [Initial Page Load](#initial-page-load)
   2. [Date Range Filter](#date-range-filter)
2. [Entity overview pages](#overview-pages)
   1. [Initial Page Load](#initial-page-load-1)
   2. [Sort](#sort)
   3. [Filter](#filter)
   4. [Change Page Size](#change-page-size)
   5. [Change Page](#change-page)
3. [The settings page](#settings)
   1. [Initial Page Load](#initial-page-load-2)
   2. [Save](#save)

## Dashboard

The dashboard page shows:
* a daterange filter
* statistics for the prescriptions folder and the [Directory Reader](../prescriptions-processor/directory-reader/README.md) application
* statistics for the prescriptions (% accepted vs rejected)
* two charts for the prescriptions

### Initial Page Load
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant directoryReader as Directory Reader
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular:open dashboard page
    angular--)-user:page with empty dashboards

    Note over angular:Fetch data for the folder stats widget
    angular->>+directoryReader:HTTP GET /stats
    directoryReader--)-angular:stats

    angular--)user:update folder stats widget with data

    Note over angular:Fetch data for the prescription stats widget
    angular->>+nestjs:HTTP GET /prescription/totalCorrectRejectedCount
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:data

    angular--)user:update prescription stats widget with data

    Note over angular:Fetch data for the prescription charts
    angular->>+nestjs:HTTP GET /prescription?skip=0&take=10000<br>&sortColumn=date&sortOrder=ASC
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:data

    angular--)user:update charts with initial data
```

### Date Range Filter
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular:select a date range in the filter: 2023-01-01 - 2023-01-31

    Note over angular:Fetch data for the prescription charts
    angular->>+nestjs:HTTP GET /prescription?skip=0&take=10000<br>&sortColumn=date&sortOrder=ASC<br>&date=%5B%222023-01-01%22,%222023-01-31%22%5D
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:data

    angular--)user:update charts with filtered data

```

## Overview Pages

There are overview pages for three entities on the Angular web app: Prescription, Doctor, and Patient.\
Each page has a table which is paginated, sortable, and filterable. By default, a page has a size of 10, and is sorted ascending on the entity's first column.\
When such a page loads, the HTML for the page is served whilst an HTTP call fetches the data for the table in the background.

The following sequence diagrams show the flow for the Prescription entity, but it is the same for the other entities.

### Initial Page Load
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular:open prescription overview page
    angular--)-user:page with paginated, sortable and filterable table

    Note over angular:Fetch data for the empty table
    angular->>+nestjs:HTTP GET<br>/prescription?skip=0&take=10&sortColumn=id&sortOrder=ASC
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:first 10 prescriptions sorted ascending on column id
    angular--)user:update table with initial data
```

### Sort
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular: sort table on name column, descending
    angular->>+nestjs:HTTP GET<br>/prescription?...&sortColumn=name&sortOrder=DESC
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:first 10 prescriptions sorted descending on column name
    angular--)-user:update table with new data
```

### Filter
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular: filter table on name = 'test'
    angular->>+nestjs:HTTP GET<br>/prescription?...&name=test
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:first 10 prescriptions sorted descending on column name, filtered on name = 'test'
    angular--)-user:update table with new data
```

### Change Page Size
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular: change the page size to 50
    angular->>+nestjs:HTTP GET<br>/prescription?skip=0&take=50...
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:first 50 prescriptions sorted descending on column name, filtered on name = 'test'
    angular--)-user:update table with new data
```

### Change Page
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular: go to the next page
    angular->>+nestjs:HTTP GET<br>/prescription?skip=50&take=50...
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:next 50 prescriptions sorted descending on column name, filtered on name = 'test'
    angular--)-user:update table with new data
```

## Settings
On the settings page a user can:
* change the order of prescription validation rules by drag&drop
* enable/disable specific rules

Both actions affect the [Rule Engine](../prescriptions-processor/rule-engine/README.md) application.

## Initial Page Load
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    user->>+angular:open settings page
    angular--)-user:page with an ordered list

    Note over angular:Fetch data for the ordered list
    angular->>+nestjs:HTTP GET /rule
    nestjs->>+db:fetch data
    db--)-nestjs:data
    nestjs--)-angular:prescription violation rules
    angular--)user:update order list with data
```

## Save
```mermaid
sequenceDiagram
    participant user as User
    participant angular as Angular Web App
    participant nestjs as NestJS HTTP Server
    participant db as SQLite Database

    Note over user,angular:User changed order of rules<br>and disabled some rules

    user->>angular:save settings page
    angular->>nestjs:HTTP POST /rule
    nestjs->>db:update rules

```
