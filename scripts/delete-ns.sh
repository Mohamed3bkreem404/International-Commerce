#!/bin/bash
kubectl delete ns test monitoring
helm uninstall app -n argocd
helm uninstall monitoring -n argocd
helm uninstall argo -n argocd

kubectl create ns test monitor

echo "Password : "
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo
echo "running port-forward"
kubectl port-forward service/argo-argocd-server -n argocd 8080:443

helm install app ../helm/argocd . -n argocd