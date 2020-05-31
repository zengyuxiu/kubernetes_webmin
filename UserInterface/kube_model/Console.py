from . import ws_client
from kubernetes import client, config


class Console():
    config_path = "~/.kube/config"
    container = ""
    URL = ""

    def __init__(self, config_path="~/.kube/config"):
        self.config_path = config_path
        config.load_kube_config(self.config_path)

    def Url(self,item):
        configuration = client.Configuration()
        api_instance = client.CoreApi(client.ApiClient(configuration))
        self.URL = api_instance.get_api_versions().server_address_by_client_cid_rs[0].server_address

