# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import render, redirect
from .forms import YAML_config_file_form, SelectContainerForm
from .models import ConfigurationFile
from .kube_model import Resource, Status, Service, Console


def start(request):
    """Start page with a documentation.
    """
    return render(request, "UserInterface/start.html",
                  {"nav_active": "start"})


def dashboard(request):
    """Dashboard page.
    """
    daemon_set = Resource.Daemon_set()
    daemon_set_list = daemon_set.List_Daemon_set_For_All_Namespaces()

    deployment = Resource.Deployment()
    deployment_list = deployment.List_Deployment_For_All_Namespaces()

    pod = Status.Pod_status()
    pod_list = pod.All_Namespaces_Pod()
    return render(request, "UserInterface/sb_admin_dashboard.html",
                  context={
                      "pod": len(pod_list),
                      "daemon_set": len(daemon_set_list),
                      "deployment": len(deployment_list),
                      "nav_active": "dashboard"})


def charts(request):
    """Charts page.
    """
    return render(request, "UserInterface/sb_admin_charts.html",
                  {"nav_active": "charts"})


def tables(request):
    """Tables page.
    """
    daemon_set = Resource.Daemon_set()
    daemon_set_list = daemon_set.List_Daemon_set_For_All_Namespaces()

    deployment = Resource.Deployment()
    deployment_list = deployment.List_Deployment_For_All_Namespaces()

    pod = Status.Pod_status()
    pod_list = pod.All_Namespaces_Pod()

    return render(request, "UserInterface/sb_admin_tables.html",
                  context={
                      "deamon_set_list": daemon_set_list,
                      "deployment_list": deployment_list,
                      "pod_list": pod_list,
                      "nav_active": "tables",
                  })


def Consoles(request):
    if request.method == "POST":
        pod = Status.Pod_status()
        pod_list = pod.All_Namespaces_Pod()
        name = request.POST['item']
        # for pod in pod_list:
        #      if name == pod.metadata.name:

        pod = Status.Pod_status()
        pod_list = pod.All_Namespaces_Pod()
        return render(request, "UserInterface/sb_admin_consoles.html",
                      context={
                          "pod_list": pod_list,
                      })

    else:
        pod = Status.Pod_status()
        pod_list = pod.All_Namespaces_Pod()
        return render(request, "UserInterface/sb_admin_consoles.html",
                      context={
                          "pod_list": pod_list,
                      })


def terminal(request, item):
    Text = item.metadata.name
    return HttpResponse(Text)


def forms(request):
    """Forms page.
    """
    if request.method == 'POST':
        form = YAML_config_file_form(request.POST, request.FILES)
        file_status = "Pleate Upload Config File"
        if form.is_valid():

            # TODO   apply the config_file
            yaml_config_file = ConfigurationFile(yaml_file=form.cleaned_data['config_file'])
            yaml_config_file.save()

            file = yaml_config_file.yaml_file
            apply = Service.apply_service()
            if file:
                apply.apply_via_yaml(file.path)

            return HttpResponseRedirect(reverse('sb_admin_tables'))
    else:
        form = YAML_config_file_form()
        file_status = "No File"

    return render(request, "UserInterface/sb_admin_forms.html",
                  {
                      'config_file': form,
                      'status': file_status,
                  })


#    return render(request, "UserInterface/sb_admin_forms.html",
#                  {"nav_active": "forms"})


def bootstrap_elements(request):
    """Bootstrap elements page.
    """
    return render(request, "UserInterface/sb_admin_bootstrap_elements.html",
                  {"nav_active": "bootstrap_elements"})


def bootstrap_grid(request):
    """Bootstrap grid page.
    """
    return render(request, "UserInterface/sb_admin_bootstrap_grid.html",
                  {"nav_active": "bootstrap_grid"})


# def dropdown(request):
#    """Dropdown  page.
#    """
#    return render(request, "UserInterface/sb_admin_dropdown.html",
#                  {"nav_active": "dropdown"})


def rtl_dashboard(request):
    """RTL Dashboard page.
    """
    return render(request, "UserInterface/sb_admin_rtl_dashboard.html",
                  {"nav_active": "rtl_dashboard"})


def blank(request):
    """Blank page.
    """
    return render(request, "UserInterface/sb_admin_blank.html",
                  {"nav_active": "blank"})
