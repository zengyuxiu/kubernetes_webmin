# Generated by Django 2.2.6 on 2019-10-18 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='apply_service',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('yaml_file', models.FileField(upload_to='service_config')),
            ],
        ),
    ]
