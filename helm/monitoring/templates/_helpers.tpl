{{/*
Generate chart name
*/}}

{{- define "monitoring.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Generate full release name
*/}}

{{- define "monitoring.fullname" -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Common labels
*/}}

{{- define "monitoring.selectorLabels" -}}

app.kubernetes.io/name: {{ include "monitoring.name" . }}

app.kubernetes.io/instance: {{ .Release.Name }}

{{- end }}