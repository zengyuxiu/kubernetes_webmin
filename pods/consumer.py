from channels.generic.websocket import WebsocketConsumer
from UserInterface.kube_model.stream import KubeApi
from threading import Thread

class K8SStreamThread(Thread):
    def __init__(self, websocket, container_stream):
        Thread.__init__(self)
        self.websocket = websocket
        self.stream = container_stream

    def run(self):
        while self.stream.is_open():
            if self.stream.peek_stdout():
                stdout = self.stream.read_stdout()
                self.websocket.send(stdout)

            if self.stream.peek_stderr():
                stderr = self.stream.read_stderr()
                self.websocket.send(stderr)
        else:
            self.websocket.close()


class SSHConsumer(WebsocketConsumer):
    def connect(self):
        self.name = self.scope["url_route"]["kwargs"]["name"]

        # kube exec
        self.stream = KubeApi().pod_exec(self.name)
        kub_stream = K8SStreamThread(self, self.stream)
        kub_stream.start()

        self.accept()

    def disconnect(self, close_code):
        self.stream.write_stdin('exit\r')

    def receive(self, text_data):
        self.stream.write_stdin(text_data)