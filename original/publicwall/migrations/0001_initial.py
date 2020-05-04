# Generated by Django 3.0.2 on 2020-03-09 23:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_content', models.TextField(default=None)),
                ('date', models.DateTimeField(default=None)),
                ('user', models.IntegerField(default=None)),
                ('pinned', models.BooleanField(default=False)),
                ('locked', models.BooleanField(default=False)),
            ],
            options={
                'permissions': [('post-post', 'Ability to add a post. '), ('bypass-time-restriction', 'can bypass time restriction'), ('edit-post', 'Can use editing post modal. ')],
            },
        ),
        migrations.CreateModel(
            name='UserCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.TextField(default=None)),
                ('expires', models.DateTimeField()),
                ('uses', models.IntegerField()),
                ('maxuses', models.IntegerField()),
            ],
            options={
                'permissions': [('make-code', 'ability to make a user registration code. ')],
            },
        ),
        migrations.CreateModel(
            name='UserExtra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(default=None, null=True)),
                ('timezone', models.TextField(default=None, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': [('edit-user', "Edit a user's properties")],
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_content', models.TextField()),
                ('date', models.DateTimeField()),
                ('user', models.IntegerField(null=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='publicwall.Post')),
            ],
            options={
                'permissions': [('make-comment', 'Ability to make a comment.'), ('bypass-lock', 'Ability to bypass a lock on a post. ')],
            },
        ),
    ]
