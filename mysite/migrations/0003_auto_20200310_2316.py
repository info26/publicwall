# Generated by Django 3.0.2 on 2020-03-10 23:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mysite', '0002_auto_20200310_1841'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userextra',
            name='description',
            field=models.TextField(default='', null=True),
        ),
    ]
