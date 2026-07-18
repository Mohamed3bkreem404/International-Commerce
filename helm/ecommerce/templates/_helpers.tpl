{{/*
Generate chart name
*/}}

{{- define "ecommerce.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Generate full release name
*/}}

{{- define "ecommerce.fullname" -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Common labels
*/}}

{{- define "ecommerce.selectorLabels" -}}

app.kubernetes.io/name: {{ include "ecommerce.name" . }}

app.kubernetes.io/instance: {{ .Release.Name }}

{{- end }}