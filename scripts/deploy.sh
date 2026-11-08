
#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
TAILSCALE_IP="100.74.230.92"

PROGRESS_FILE="$SCRIPT_DIR/.rebuild-progress"
LAST_STEP=0

[[ -f "$PROGRESS_FILE" ]] && LAST_STEP=$(cat "$PROGRESS_FILE")

run_step() {
    local step="$1"
    local name="$2"
    shift 2

    if (( LAST_STEP >= step )); then
        echo "=== Skipping $step: $name ==="
        return
    fi

    echo "=== $step: $name ==="
    "$@"

    echo "$step" > "$PROGRESS_FILE"
    LAST_STEP=$step
}

uninstall_releases() {
    helm uninstall app -n argocd --ignore-not-found || true
    helm uninstall argo -n argocd --ignore-not-found || true
    helm uninstall monitoring -n monitoring --ignore-not-found || true
    helm uninstall kube-prometheus-stack-93.1.0 -n default --ignore-not-found || true
}

delete_namespaces() {
    kubectl delete namespace test app argocd monitoring \
        --ignore-not-found \
        --wait=true \
        --timeout=180s
}

create_namespaces() {
    for ns in argocd app monitoring; do
        kubectl create namespace "$ns" \
            --dry-run=client -o yaml | kubectl apply -f -
    done
}

install_argo() {
    helm upgrade --install argo argo/argo-cd -n argocd
}

wait_for_argo() {
    kubectl wait --for=condition=Established --timeout=120s \
        crd/applications.argoproj.io crd/appprojects.argoproj.io

    kubectl wait --for=condition=Available deployment --all \
        -n argocd --timeout=300s

    kubectl rollout status statefulset/argo-argocd-application-controller \
        -n argocd --timeout=300s
}

install_app() {
    helm upgrade --install app "$REPO_ROOT/helm/argocd" -n argocd
}

show_password() {
    for i in {1..30}; do
        kubectl get secret argocd-initial-admin-secret \
            -n argocd >/dev/null 2>&1 && break
        sleep 2
    done

    kubectl get secret argocd-initial-admin-secret -n argocd >/dev/null

    echo "Initial admin password:"
    kubectl -n argocd get secret argocd-initial-admin-secret \
        -o jsonpath='{.data.password}' | base64 -d
    echo
}

run_step 1 "Uninstalling old Helm releases" uninstall_releases
run_step 2 "Deleting project namespaces" delete_namespaces
run_step 3 "Recreating namespaces" create_namespaces
run_step 4 "Installing Argo CD" install_argo
run_step 5 "Waiting for Argo CD" wait_for_argo
run_step 6 "Installing Applications and AppProject" install_app
run_step 7 "Getting admin password" show_password
run_step 8 "Listing Applications" kubectl get applications -n argocd

echo
echo "=== Starting Port-forwards ==="

cleanup() {
    [[ -n "${ARGO_PF_PID:-}" ]] && kill "$ARGO_PF_PID" 2>/dev/null || true
    [[ -n "${LONGHORN_PF_PID:-}" ]] && kill "$LONGHORN_PF_PID" 2>/dev/null || true
    [[ -n "${TRAEFIK_PF_PID:-}" ]] && kill "$TRAEFIK_PF_PID" 2>/dev/null || true
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

ARGO_PF_PID=""
LONGHORN_PF_PID=""
TRAEFIK_PF_PID=""

kubectl port-forward --address "$TAILSCALE_IP" \
    -n argocd svc/argo-argocd-server 8080:443 \
    >/tmp/argo-port-forward.log 2>&1 &
ARGO_PF_PID=$!

if kubectl get svc longhorn-frontend -n longhorn-system >/dev/null 2>&1; then
    kubectl port-forward --address "$TAILSCALE_IP" \
        -n longhorn-system svc/longhorn-frontend 8081:80 \
        >/tmp/longhorn-port-forward.log 2>&1 &
    LONGHORN_PF_PID=$!
fi

if kubectl get svc rke2-traefik -n kube-system >/dev/null 2>&1; then
    kubectl port-forward --address "$TAILSCALE_IP" \
        -n kube-system svc/rke2-traefik 8082:80 \
        >/tmp/traefik-port-forward.log 2>&1 &
    TRAEFIK_PF_PID=$!
fi

echo
echo "=== Access URLs ==="
echo "Argo CD:    https://$TAILSCALE_IP:8080"
echo "Longhorn:   http://$TAILSCALE_IP:8081"
echo "E-commerce: http://$TAILSCALE_IP:8082"
echo
echo "Port-forwards running. Press Ctrl+C to stop."

wait "$ARGO_PF_PID"
