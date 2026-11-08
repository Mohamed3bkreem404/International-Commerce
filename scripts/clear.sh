
#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

PROGRESS_FILE="$SCRIPT_DIR/.destroy-progress"
BUILD_PROGRESS_FILE="$SCRIPT_DIR/.build-progress"

LAST_STEP=0

if [[ "${1:-}" == "--reset" ]]; then
    rm -f "$PROGRESS_FILE"
    echo "Destroy progress reset."
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

echo "========== DESTROY STARTED =========="

run_step 1 "Uninstalling old Helm releases" uninstall_releases
run_step 2 "Deleting project namespaces" delete_namespaces

echo
echo "========== DESTROY COMPLETED =========="

# A new build must start from the beginning.
rm -f "$BUILD_PROGRESS_FILE"

# Allow the next destroy execution to start fresh.
rm -f "$PROGRESS_FILE" "$PROGRESS_FILE.tmp"

echo "Build progress cleared."
