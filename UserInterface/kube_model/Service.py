from django.db import models
from kubernetes import client, config
from kubernetes.utils import create_from_yaml


class apply_service():
    config_path = "~/.kube/kind-config-kind"
    config.load_kube_config(config_path)

    def apply_via_yaml(self, file):
        configuration = client.Configuration()
        k8s_client = client.ApiClient(configuration)
        create_from_yaml(k8s_client=k8s_client, yaml_file=file)
