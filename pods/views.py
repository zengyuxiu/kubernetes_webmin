# Create your views here.

from django.shortcuts import render


def pod_attach(request, name):
    return render(request, 'index.html',
                  context={
                      'name': name
                  })
