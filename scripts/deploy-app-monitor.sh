
#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== 1. Uninstalling Helm releases ==="

helm uninstall app -n argocd --ignore-not-found || true
helm uninstall argo -n argocd --ignore-not-found || true

echo "=== 2. Deleting namespaces ==="

kubectl delete namespace test monitor argocd \
  --ignore-not-found \
  --wait=true \
  --timeout=180s

echo "=== 3. Recreating namespaces ==="

kubectl create namespace argocd
kubectl create namespace test
kubectl create namespace monitor

echo "=== 4. Installing Argo CD ==="

helm install argo argo/argo-cd -n argocd

echo "=== 5. Waiting for Argo CD ==="

kubectl wait \
  --for=condition=Established \
  --timeout=120s \
  crd/applications.argoproj.io \
  crd/appprojects.argoproj.io

kubectl wait \
  --for=condition=Available \
  deployment --all \
  -n argocd \
  --timeout=300s

kubectl rollout status \
  statefulset/argo-argocd-application-controller \
  -n argocd \
  --timeout=300s

echo "=== 6. Installing your Application and AppProject chart ==="

helm install app ../helm/argocd -n argocd

echo "=== 7. Waiting for initial admin password ==="

for i in {1..30}; do
  if kubectl get secret argocd-initial-admin-secret \
      -n argocd >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if kubectl get secret argocd-initial-admin-secret \
    -n argocd >/dev/null 2>&1; then
  echo "Initial admin password:"
  kubectl -n argocd get secret argocd-initial-admin-secret \
    -o jsonpath='{.data.password}' | base64 -d
  echo
else
  echo "Initial password secret not found."
  echo "Check Argo CD server logs and Helm values."
  exit 1
fi

echo "=== 8. Current Applications ==="

kubectl get applications -n argocd

echo "=== 9. Starting port-forward ==="

kubectl port-forward \
  --address 100.74.230.92 \
  service/argo-argocd-server \
  -n argocd 8080:443
