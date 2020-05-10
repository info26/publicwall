# Generated by Django 3.0.1 on 2020-05-08 21:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publicwall', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'permissions': [('add-comment', 'Ability to make a comment.'), ('bypass-lock', 'Ability to bypass a lock on a post. ')]},
        ),
        migrations.AlterModelOptions(
            name='post',
            options={'permissions': [('add-post', 'Ability to add a post. '), ('bypass-time-restriction', 'can bypass time restriction'), ('edit-post', 'Can use editing post modal. ')]},
        ),
        migrations.AlterModelOptions(
            name='usercode',
            options={},
        ),
        migrations.AlterModelOptions(
            name='userextra',
            options={},
        ),
    ]
