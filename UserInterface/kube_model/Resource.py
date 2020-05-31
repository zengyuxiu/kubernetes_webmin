from kubernetes import client, config
from kubernetes.utils import create_from_yaml
from kubernetes.client.rest import ApiException
from pprint import pprint


class Deployment():
    config_path = "~/.kube/config"

    def __init__(self, config_path="~/.kube/config"):
        self.config_path = config_path
        config.load_kube_config(self.config_path)

    def List_Deployment_For_All_Namespaces(self):
        configuration = client.Configuration()
        api_instance = client.AppsV1Api(client.ApiClient(configuration))
        # _continue = '_continue_example'  # str | The continue option should be set when retrieving more results from the server. Since this value is server defined, kube_model.clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the kube_model.client needs a consistent list, it must restart their list without the continue field. Otherwise, the kube_model.client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the \"next key\".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. (optional)
        # field_selector = 'field_selector_example'  # str | A selector to restrict the list of returned objects by their fields. Defaults to everything. (optional)
        # label_selector = 'label_selector_example'  # str | A selector to restrict the list of returned objects by their labels. Defaults to everything. (optional)
        # limit = 56  # int | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and kube_model.clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, kube_model.clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a kube_model.client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. (optional)
        pretty = 'true'  # str | If 'true', then the output is pretty printed. (optional)
        # resource_version = 'resource_version_example'  # str | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history. When specified for list: - if unset, then the result is returned from remote storage based on quorum-read flag; - if it's 0, then we simply return what we currently have in cache, no guarantee; - if set to non zero, then the result is at least as fresh as given rv. (optional)
        timeout_seconds = 56  # int | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. (optional)
        watch = False  # bool | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. (optional)

        api_response = api_instance.list_deployment_for_all_namespaces(pretty=pretty, watch=watch)

        return api_response.items


class Daemon_set():
    config_path = "~/.kube/config"

    def __init__(self, config_path="~/.kube/config"):
        self.config_path = config_path
        config.load_kube_config(self.config_path)

    # return daemon_set list(type:List) for all namespaces
    def List_Daemon_set_For_All_Namespaces(self):
        configuration = client.Configuration()
        api_instance = client.AppsV1Api(client.ApiClient(configuration))

        pretty = 'true'  # str | If 'true', then the output is pretty printed. (optional)

        watch = False  # bool | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. (optional)

        api_response = api_instance.list_daemon_set_for_all_namespaces(pretty=pretty, watch=watch)
        return api_response.items
