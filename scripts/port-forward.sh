
#!/usr/bin/env bash
set -Eeuo pipefail

TAILSCALE_IP="100.74.230.92"

PIDS=()

cleanup() {
  echo
  echo "Stopping port-forwards..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
}

trap cleanup EXIT INT TERM

start_port_forward() {
  local name="$1"
  local namespace="$2"
  local service="$3"
  local ports="$4"
  local log_file="$5"

  if ! kubectl -n "$namespace" get svc "$service" >/dev/null 2>&1; then
    echo "WARNING: $name service not found; skipping."
    return 0
  fi

  echo "Starting $name port-forward..."
  kubectl port-forward --address "$TAILSCALE_IP" \
    -n "$namespace" "svc/$service" "$ports" \
    >"$log_file" 2>&1 &

  PIDS+=("$!")
}

echo "=== Checking Kubernetes connectivity ==="

kubectl get nodes

echo
echo "=== Starting port-forwards ==="

start_port_forward "Argo CD" "argocd" "argo-argocd-server" \
  "8080:443" "/tmp/argo-port-forward.log"

start_port_forward "Longhorn" "longhorn-system" "longhorn-frontend" \
  "8081:80" "/tmp/longhorn-port-forward.log"

start_port_forward "Traefik" "kube-system" "rke2-traefik" \
  "8082:80" "/tmp/traefik-port-forward.log"

echo
echo "=== Access URLs ==="
echo "Argo CD:    https://$TAILSCALE_IP:8080"
echo "Longhorn:   http://$TAILSCALE_IP:8081"
echo "E-commerce: http://$TAILSCALE_IP:8082"
echo
echo "Logs:"
echo "Argo CD:  /tmp/argo-port-forward.log"
echo "Longhorn: /tmp/longhorn-port-forward.log"
echo "Traefik:  /tmp/traefik-port-forward.log"
echo
echo "Port-forwards are running. Press Ctrl+C to stop."

while true; do
  sleep 1
done

echo
echo "=== Argo CD Credentials ==="
echo "Username: admin"
echo -n "Password: "
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 --decode
echo
