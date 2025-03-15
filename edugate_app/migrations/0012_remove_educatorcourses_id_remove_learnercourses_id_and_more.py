# Generated by Django 5.0.3 on 2024-05-01 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edugate_app', '0011_alter_educator_mobile_no_alter_learner_mobile_no'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='educatorcourses',
            name='id',
        ),
        migrations.RemoveField(
            model_name='learnercourses',
            name='id',
        ),
        migrations.RemoveField(
            model_name='releasedcourses',
            name='id',
        ),
        migrations.AlterField(
            model_name='educatorcourses',
            name='course_id',
            field=models.BigIntegerField(primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='learnercourses',
            name='learner_id',
            field=models.BigIntegerField(max_length=100, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='releasedcourses',
            name='course_id',
            field=models.BigIntegerField(primary_key=True, serialize=False, unique=True),
        ),
    ]
