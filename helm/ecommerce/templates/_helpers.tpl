{{- define "ecommerce.fullname" -}}
{{- printf "%s" .Release.Name}}
{{- end }}

{{- define "ecommerce.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}