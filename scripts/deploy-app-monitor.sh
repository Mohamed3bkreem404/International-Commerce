
#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
TAILSCALE_IP="100.74.230.92"

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

kubectl wait --for=condition=Established --timeout=120s \
  crd/applications.argoproj.io crd/appprojects.argoproj.io

kubectl wait --for=condition=Available deployment --all \
  -n argocd --timeout=300s

kubectl rollout status statefulset/argo-argocd-application-controller \
  -n argocd --timeout=300s

echo "=== 6. Installing Application and AppProject chart ==="

helm install app "$REPO_ROOT/helm/argocd" -n argocd

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
  exit 1
fi

echo "=== 8. Current Applications ==="
kubectl get applications -n argocd

echo "=== 9. Starting Argo CD port-forward ==="

kubectl port-forward --address "$TAILSCALE_IP" \
  -n argocd svc/argo-argocd-server 8080:443 \
  >/tmp/argo-port-forward.log 2>&1 &
ARGO_PF_PID=$!

echo "=== 10. Starting Longhorn port-forward ==="

if kubectl get svc longhorn-frontend -n longhorn-system \
    >/dev/null 2>&1; then
  kubectl port-forward --address "$TAILSCALE_IP" \
    -n longhorn-system svc/longhorn-frontend 8081:80 \
    >/tmp/longhorn-port-forward.log 2>&1 &
  LONGHORN_PF_PID=$!
else
  echo "Longhorn frontend service not found; skipping its port-forward."
  LONGHORN_PF_PID=""
fi

cleanup() {
  kill "$ARGO_PF_PID" ${LONGHORN_PF_PID:+"$LONGHORN_PF_PID"} \
    2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Argo CD:  https://$TAILSCALE_IP:8080"
echo "Longhorn: http://$TAILSCALE_IP:8081"
echo "Port-forwards are running. Press Ctrl+C to stop."

wait "$ARGO_PF_PID"
