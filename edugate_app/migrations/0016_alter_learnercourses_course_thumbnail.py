# Generated by Django 5.0.3 on 2024-05-01 16:11

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edugate_app', '0015_alter_learnercourses_course_exercise_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='learnercourses',
            name='course_thumbnail',
            field=models.URLField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
