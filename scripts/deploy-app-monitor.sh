#!/bin/bash
kubectl delete ns test monitor
helm uninstall app -n argocd
helm uninstall argo -n argocd

kubectl create ns monitor
kubectl create ns test

helm install argo argo/argo-cd -n argocd
helm install app ../helm/argocd -n argocd

echo "Password : "
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo
echo "running port-forward"
kubectl port-forward service/argo-argocd-server -n argocd 8080:443

