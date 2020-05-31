from kubernetes import client, config
from kubernetes.utils import create_from_yaml
from kubernetes.client.rest import ApiException
from pprint import pprint


class Pod_status():
    config_path = "~/.kube/config"

    def __init__(self, config_path="~/.kube/config"):
        self.config_path = config_path
        config.load_kube_config(self.config_path)

    def All_Namespaces_Pod(self):
        configuration = client.Configuration()
        api_instance = client.CoreV1Api(client.ApiClient(configuration))
        # print("Listing pods with their IPs:")
        api_response = api_instance.list_pod_for_all_namespaces(watch=False, pretty="true")
        return api_response.items

    def Get_Api_resources(self):
        configuration = client.Configuration()
        api_instance = client.ApiregistrationV1Api(client.ApiClient(configuration))
        try:
            api_response = api_instance.get_api_resources()
            pprint(api_response)
        except ApiException as e:
            print("Exception when calling ApiregistrationV1Api->get_api_resources: %s\n" % e)

    def Read_Custom_Resource_Definition_Status(self, name):
        configuration = client.Configuration()
        api_instance = client.ApiextensionsV1beta1Api(client.ApiClient(configuration))
        try:
            api_response = api_instance.read_custom_resource_definition_status(name, pretty='true')
            pprint(api_response)
        except ApiException as e:
            print("Exception when calling ApiextensionsV1beta1Api->read_custom_resource_definition_status: %s\n" % e)
