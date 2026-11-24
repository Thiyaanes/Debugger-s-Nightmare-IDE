#  Debugger's Nightmare IDE
🐛 Debugger's Nightmare IDE

A cursed IDE simulator that turns debugging into chaos — write code, face sarcastic errors, and watch auto-fixes reveal the correct output!

##  Features

- **Multi-language Support:** JavaScript, Python, and C++ code execution/emulation.
- **Sarcastic Errors:** Funny and unexpected error messages when you run your code.
- **Timer-Based Challenge:** 15-second countdown before automatic correction.
- **Auto-Correction:** If you give up or the timer expires, the IDE reveals the corrected output.
- **Interactive Console:** Dedicated input and output panels with fixed labels.
- **Python Emulation:** Supports loops, if/else conditions, nested loops, and array iterations.
- **Code Editor:** Integrated ACE Editor for an interactive coding experience.

## 🛠️ Tech Stack

### Application
- HTML5
- CSS3
- JavaScript
- Python (Flask)
- ACE Editor
- Skulpt

### DevOps & Deployment
- **Git & GitHub** – Version control and source code management.
- **Docker** – Containerization of frontend and backend.
- **Docker Hub** – Docker image storage and distribution.
- **Kubernetes** – Container orchestration using Deployments and Services.
- **GitHub Actions** – Automated CI/CD pipeline for building and pushing Docker images.
- **Nginx** – Frontend web server.

## 📁 Project Structure

```text
Debugger-s-Nightmare-IDE/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── k8s/
│   └── app.yaml
│
├── Dockerfile
├── Dockerfile.backend
├── .dockerignore
├── requirements.txt
│
├── app.py
├── index.html
├── script.js
├── style.css
│
└── README.md
```

## 💻 Run Locally

### Prerequisites
- Python 3.x
- Visual Studio Code
- Live Server extension

### Steps

1. Clone the repository:

```bash
git clone https://github.com/Thiyaanes/Debugger-s-Nightmare-IDE.git
```

2. Open the project in VS Code.

3. Install the Live Server extension.

4. Right-click `index.html` and select **Open with Live Server**.

5. The IDE will open in your browser. Select a language, write code, and run it.

## 🐳 Docker Setup

This project uses separate Dockerfiles for the frontend and backend.

### Build Frontend Image

```bash
docker build -t thiyaanes/debugger-frontend:v1 -f Dockerfile .
```

### Build Backend Image

```bash
docker build -t thiyaanes/debugger-backend:v1 -f Dockerfile.backend .
```

### Push Images to Docker Hub

```bash
docker login

docker push thiyaanes/debugger-frontend:v1

docker push thiyaanes/debugger-backend:v1
```

##  Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory.

The configuration includes:

- **Frontend Deployment:** Runs 3 frontend replicas.
- **Frontend Service:** NodePort service exposing the application.
- **Backend Deployment:** Runs 2 backend replicas.
- **Backend Service:** ClusterIP service for internal backend access.

### Deploy to Kubernetes

```bash
kubectl apply -f k8s/app.yaml
```

### Check Deployments

```bash
kubectl get deployments
```

### Check Pods

```bash
kubectl get pods
```

### Check Services

```bash
kubectl get services
```

### Access the Application

For Docker Desktop Kubernetes:

```text
http://localhost:32000
```

##  CI/CD with GitHub Actions

This project uses GitHub Actions to automate Docker image building and publishing.

### Workflow

The pipeline is triggered when:

- Code is pushed to the `main` branch.
- A pull request is created targeting the `main` branch.

### Pipeline Steps

1. Checkout the source code.
2. Set up Docker Buildx.
3. Authenticate with Docker Hub.
4. Build the frontend Docker image.
5. Build the backend Docker image.
6. Push both images to Docker Hub on pushes to `main`.

Pull requests trigger image builds without publishing images.

### Configure GitHub Secrets

Add the following repository secrets:

| Secret Name | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

Navigate to:

**GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

##  Try It Out

**Live Application:** https://debugger-s-nightmare-ide.vercel.app

**GitHub Repository:** https://github.com/Thiyaanes/Debugger-s-Nightmare-IDE

---

##  Project Overview

Debugger's Nightmare IDE started as a fun browser-based coding simulator and evolved into a containerized application with a DevOps workflow.

The project demonstrates frontend development, Python backend development, Docker containerization, Kubernetes orchestration, and automated CI/CD using GitHub Actions.
