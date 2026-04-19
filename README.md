graph TD
    %% Client Tier
    Client[📱 Next.js 14 Frontend]

    %% AWS Cloud Environment
    subgraph AWS Cloud Environment
        ALB[🌐 AWS Load Balancer]
        
        subgraph Kubernetes Cluster K3s
            NodePort[🚪 NodePort 30000]
            Gateway[🚦 API Gateway]
            
            %% Microservices
            subgraph Microservices Layer
                Auth[🔒 Auth Service]
                Product[📦 Product Service]
                Cart[🛒 Cart Service]
                Order[📝 Order Service]
                Payment[💳 Payment Service]
            end
            
            %% Databases
            subgraph Data Persistence
                DB_Auth[(PostgreSQL Auth)]
                DB_Prod[(PostgreSQL Prod)]
                DB_Cart[(PostgreSQL Cart)]
                DB_Order[(PostgreSQL Order)]
                DB_Pay[(PostgreSQL Pay)]
                Redis[(Redis Cache)]
            end
        end
    end

    %% CI/CD Pipeline
    subgraph CI/CD Automation
        GitHub[🐙 GitHub Actions]
        DockerHub[🐳 Docker Hub]
    end

    %% External Connections
    Client -->|HTTPS Traffic| ALB
    ALB -->|Target Group Routing| NodePort
    NodePort --> Gateway
    
    %% Gateway Routing
    Gateway --> Auth
    Gateway --> Product
    Gateway --> Cart
    Gateway --> Order
    Gateway --> Payment
    
    %% Caching
    Product -->|Read/Write| Redis
    
    %% DB Connections
    Auth --> DB_Auth
    Product --> DB_Prod
    Cart --> DB_Cart
    Order --> DB_Order
    Payment --> DB_Pay
    
    %% Synchronous Inter-service Communication
    Order -.->|OpenFeign Call| Payment
    Cart -.->|OpenFeign Call| Product
    
    %% DevOps Flow
    GitHub -->|1. Build & Push Image| DockerHub
    GitHub -->|2. Secure SSH Inject Secrets & Deploy| Kubernetes Cluster K3s
    
    %% Styling for visual appeal
    classDef aws fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:black;
    classDef k8s fill:#326CE5,stroke:#fff,stroke-width:2px,color:white;
    classDef microservice fill:#6DB33F,stroke:#fff,stroke-width:2px,color:white;
    classDef database fill:#336791,stroke:#fff,stroke-width:2px,color:white;
    
    class ALB aws;
    class Gateway,Auth,Product,Cart,Order,Payment microservice;
    class DB_Auth,DB_Prod,DB_Cart,DB_Order,DB_Pay database;
