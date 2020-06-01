from django.urls import path
from pods.views import pod_attach

urlpatterns = [
    path('<str:name>', pod_attach)
]
