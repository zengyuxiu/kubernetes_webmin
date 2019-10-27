from django.urls import path

from . import views

urlpatterns = [
    path('', views.start, name='sb_admin_start'),
    path('dashboard/', views.dashboard, name='sb_admin_dashboard'),
    path('charts/', views.charts, name='sb_admin_charts'),
    path('tables/', views.tables, name='sb_admin_tables'),
    path('forms/', views.forms, name='sb_admin_forms'),
    path('bootstrap-elements/', views.bootstrap_elements, name='sb_admin_bootstrap_elements'),
    path('bootstrap-grid/', views.bootstrap_grid, name='sb_admin_bootstrap_grid'),
    path('rtl-dashboard/', views.rtl_dashboard, name='sb_admin_rtl_dashboard'),
    path('blank/', views.blank, name='sb_admin_blank'),
]
