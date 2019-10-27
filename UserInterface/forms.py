from django import forms
from django.forms import ModelForm
from .kube_model import Service


class YAMLConfigModelFrom(ModelForm):
    # TODO :use ModelForm to implete form
    def clean_config_file(self):
        config_file = self.cleaned_data['config_file']
        return config_file


class YAML_config_file_form(forms.Form):
    config_file = forms.FileField(help_text="Please upload your config file!")

    def cleanned_config_file(self):
        file = self.cleaned_data['config_file']
        return file
