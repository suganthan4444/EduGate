# Generated by Django 5.0.3 on 2024-04-25 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edugate_app', '0003_superadmin_alter_educator_educator_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='learner',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='learner_profile_pictures/'),
        ),
    ]
