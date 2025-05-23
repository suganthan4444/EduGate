# Generated by Django 5.0.3 on 2024-04-28 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edugate_app', '0004_learner_profile_picture'),
    ]

    operations = [
        migrations.RenameField(
            model_name='educatorcourses',
            old_name='course_exercise',
            new_name='course_exercise_url',
        ),
        migrations.AddField(
            model_name='educatorcourses',
            name='course_price',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='educatorcourses',
            name='course_video',
            field=models.FileField(upload_to='course_videos/'),
        ),
    ]
