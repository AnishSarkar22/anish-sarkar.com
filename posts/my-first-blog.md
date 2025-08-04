---
title: "Getting Started with Backend Development: My Journey"
description: "Explore my journey into backend development, from learning Python fundamentals to building scalable applications. Discover key insights, tools, and best practices for aspiring backend developers."
date: "2025-08-1"
---

Welcome to my first blog post! As a backend developer and AIML enthusiast, I'm excited to share my journey and insights with you.

## Why Backend Development?

Backend development is the backbone of modern applications. It's where the magic happens - data processing, business logic, and system architecture all come together to create powerful, scalable solutions.

Here's a simple Python example that demonstrates basic server functionality:

```python
print("Hello, World!")
for i in range(0, 10):
    print(f"Processing request {i + 1}")
```

## System Architecture Overview

Let me show you how I typically structure backend systems:

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

# List

1. hola
2. hello
3. hi

# Quotes

> Testing the UI

# Table

| Header 1  | Header 2  | Header 3  |
|-----------|-----------|-----------|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
| Row 3 Col 1 | Row 3 Col 2 | Row 3 Col 3 |


# Link

[link of something](https://anish-sarkar.com)