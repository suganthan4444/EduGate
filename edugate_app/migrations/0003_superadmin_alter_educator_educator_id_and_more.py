# Generated by Django 5.0.3 on 2024-04-25 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edugate_app', '0002_alter_educator_educator_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SuperAdmin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='educator',
            name='educator_id',
            field=models.BigIntegerField(primary_key=True, serialize=False, unique=True, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='educatorcourses',
            name='course_exercise_id',
            field=models.BigIntegerField(unique=True),
        ),
        migrations.AlterField(
            model_name='educatorcourses',
            name='course_id',
            field=models.BigIntegerField(unique=True),
        ),
        migrations.AlterField(
            model_name='educatorcourses',
            name='course_video_id',
            field=models.BigIntegerField(unique=True),
        ),
        migrations.AlterField(
            model_name='learner',
            name='learner_id',
            field=models.BigIntegerField(primary_key=True, serialize=False, unique=True, verbose_name='ID'),
        ),
    ]
