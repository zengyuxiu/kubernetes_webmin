from django.urls import path
from pods.views import pod_attach

urlpatterns = [
    path('',pod_attach)
]