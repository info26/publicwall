# Generated by Django 3.0.1 on 2020-05-14 16:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publicwall', '0003_auto_20200510_2250'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'permissions': [('add-post', 'Ability to add a post. '), ('bypass-time-restriction', 'can bypass time restriction'), ('admin', 'Can use sudo interface. ')]},
        ),
    ]
