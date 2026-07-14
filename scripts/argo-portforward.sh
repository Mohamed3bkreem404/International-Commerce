#echo "Password : "
#kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
#echo
echo "running port-forward"
kubectl port-forward service/argo-argocd-server -n argocd 8080:443
