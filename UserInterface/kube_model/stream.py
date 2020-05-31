from kubernetes import client, config
from kubernetes.stream import stream

class KubeApi:
    def __init__(self, namespace='default'):
        config.load_kube_config("~/.kube/config")

        self.namespace = namespace

    def pod_exec(self, pod, container=""):
        api_instance = client.CoreV1Api()
        exec_command = [
            "/bin/sh",
            "-c",
            'TERM=xterm-256color; export TERM; [ -x /bin/bash ] '
            '&& ([ -x /usr/bin/script ] '
            '&& /usr/bin/script -q -c "/bin/bash" /dev/null || exec /bin/bash) '
            '|| exec /bin/sh']

        pod = 'nginx-deployment-67656986d9-5ql6b'
        cont_stream = stream(api_instance.connect_get_namespaced_pod_exec,
                             name=pod,
                             namespace=self.namespace,
                             container=container,
                             command=exec_command,
                             stderr=True, stdin=True,
                             stdout=True, tty=True,
                             _preload_content=False
                             )

        return cont_stream
