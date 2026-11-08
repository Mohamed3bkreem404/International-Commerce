
#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

TAILSCALE_IP="100.74.230.92"

PROGRESS_FILE="$SCRIPT_DIR/.build-progress"
LAST_STEP=0

if [[ "${1:-}" == "--reset" ]]; then
    rm -f "$PROGRESS_FILE"
    echo "Build progress reset."
fi

if [[ -f "$PROGRESS_FILE" ]]; then
    LAST_STEP=$(<"$PROGRESS_FILE")
    [[ "$LAST_STEP" =~ ^[0-9]+$ ]] || LAST_STEP=0
fi

run_step() {
    local step="$1"
    local name="$2"
    shift 2

    if (( LAST_STEP >= step )); then
        echo "=== Skipping $step: $name ==="
        return 0
    fi

    echo
    echo "=== $step: $name ==="

    "$@"

    printf '%s\n' "$step" > "$PROGRESS_FILE.tmp"
    mv "$PROGRESS_FILE.tmp" "$PROGRESS_FILE"

    LAST_STEP=$step
    echo "=== Step $step completed ==="
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

echo "========== BUILD STARTED =========="

run_step 1 "Creating namespaces" create_namespaces
run_step 2 "Installing Argo CD" install_argo
run_step 3 "Waiting for Argo CD" wait_for_argo
run_step 4 "Installing Applications and AppProject" install_app
run_step 5 "Getting admin password" show_password
run_step 6 "Listing Applications" kubectl get applications -n argocd

# Port-forwards are always started, even when build steps are skipped.

echo
echo "=== Starting Port-forwards ==="

ARGO_PF_PID=""
LONGHORN_PF_PID=""
TRAEFIK_PF_PID=""

cleanup() {
    echo
    echo "Stopping Port-forwards..."

    [[ -n "$ARGO_PF_PID" ]] && kill "$ARGO_PF_PID" 2>/dev/null || true
    [[ -n "$LONGHORN_PF_PID" ]] && kill "$LONGHORN_PF_PID" 2>/dev/null || true
    [[ -n "$TRAEFIK_PF_PID" ]] && kill "$TRAEFIK_PF_PID" 2>/dev/null || true
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

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
echo "========== ACCESS URLS =========="
echo "Argo CD:    https://$TAILSCALE_IP:8080"
echo "Longhorn:   http://$TAILSCALE_IP:8081"
echo "E-commerce: http://$TAILSCALE_IP:8082"
echo
echo "Port-forwards running. Press Ctrl+C to stop."

wait "$ARGO_PF_PID"
