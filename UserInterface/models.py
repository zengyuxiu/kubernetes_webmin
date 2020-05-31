from django.db import models
from .kube_model import Resource, Status
# Create your models here.


from django.db import models
from kubernetes import client, config
from kubernetes.utils import create_from_yaml
from kubernetes.client.models import v1_node


class Pod(models.Model):
    name = models.CharField(max_length=255, help_text="pod's unique name", unique=True, primary_key=True)
    # api_url = models.CharField(max_length=255, help_text="api_url", unique=True)
    # api_token = models.TextField(verbose_name=u"connect token", help_text="api_token")
    ws_url = models.CharField(max_length=255, help_text="websocket_url", unique=True)
    # ws_token = models.TextField(verbose_name=u"websocket_connect_token", help_text="websocket_token")


class ConfigurationFile(models.Model):
    config_path = "~/.kube/config"
    config.load_kube_config(config_path)
    yaml_file = models.FileField(upload_to='service_config')


# def Connect(request):
