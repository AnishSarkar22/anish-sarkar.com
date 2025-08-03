---
title: "My Blog Post"
description: "A short test."
date: "2025-08-1"
---

This is my first test blog. 

this is a simple python program:

```python
print("hello world")
for i in range(0, n):
    i += 1
```

this is a mermaid, asshole:

```mermaid
graph TB
    %% User Interface
    User[User Dashboard]
    
    %% Core Application
    subgraph "Loopr Backend"
        API[SvelteKit App<br/>REST API]
        Appwrite[Appwrite BaaS<br/>Auth + Database]
    end
    
    %% Serverless Functions
    subgraph "Automated Functions"
        Monitor[URL Monitor]
        Workers[Load Balancer] 
        Webhooks[Webhook Scheduler]
        Cleanup[Data Cleanup]
    end
    
    %% Data Storage
    subgraph "Database Collections"
        URLs[(URLs)]
        Results[(Results)]
        Nodes[(Worker Nodes)]
        Alerts[(Notifications)]
    end
    
    %% External
    Internet[Monitored URLs<br/>External APIs]
    Email[SMTP Alerts]
    
    %% Connections
    User --> API
    API --> Appwrite
    Appwrite --> Monitor
    Appwrite --> Workers
    Appwrite --> Webhooks
    Appwrite --> Cleanup
    
    Monitor --> URLs
    Monitor --> Results
    Monitor --> Internet
    Monitor --> Alerts
    
    Workers --> URLs
    Workers --> Nodes
    
    Webhooks --> Internet
    
    Cleanup --> Results
    Cleanup --> URLs
    
    Alerts --> Email
    
    %% Styling
    class Monitor,Workers,Webhooks,Cleanup functions
    class URLs,Results,Nodes,Alerts data
    class Internet,Email external
```

temp:
1. asd
2. sad
3. asss

> sdsadadasasd
> asdasdads
