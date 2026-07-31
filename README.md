## 🏗️ Platform Architecture

<p align="center">
  <img
    src="/home/ineutron/Downloads/E-Commerce Project/ecommerceArch.png"
    alt="International Commerce Platform Architecture"
    width="100%"
  />
</p>

<p align="center">
  <sub>
    End-to-end cloud-native platform architecture covering AWS infrastructure,
    Kubernetes, Terraform, Ansible, CI/CD, GitOps, security, and observability.
  </sub>
</p>

<details>
<summary><b>View request and deployment flows</b></summary>

<br/>

```mermaid
flowchart LR
    %% User traffic flow
    USER[User] --> DNS[Route 53]
    DNS --> TLS[ACM / TLS]
    TLS --> ALB[Application Load Balancer]
    ALB --> ING[NGINX Ingress]
    ING --> GW[API Gateway]

    GW --> US[User Service]
    GW --> PS[Product Service]
    GW --> CS[Cart Service]
    GW --> OS[Order Service]
    GW --> PAY[Payment Service]

    US --> UDB[(User PostgreSQL)]
    PS --> PDB[(Product PostgreSQL)]
    CS --> CDB[(Cart PostgreSQL)]
    OS --> ODB[(Order PostgreSQL)]
    PAY --> PAYDB[(Payment PostgreSQL)]

    PS --> REDIS[(Redis)]

    %% Delivery flow
    DEV[Developer] --> GH[GitHub]
    GH --> GHA[GitHub Actions]
    GHA --> BUILD[Docker Build]
    BUILD --> ECR[Amazon ECR]
    GHA --> TF[Terraform]
    TF --> AWS[AWS Infrastructure]
    GHA --> ANS[Ansible]
    ANS --> K8S[Kubernetes Cluster]

    GH --> ARGO[Argo CD]
    ARGO --> HELM[Helm Charts]
    HELM --> K8S
    ECR --> K8S

    %% Observability
    K8S --> PROM[Prometheus]
    PROM --> GRAF[Grafana]
    PROM --> ALERT[Alertmanager]
```

</details>
