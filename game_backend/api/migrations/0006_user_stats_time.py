# Generated by Django 3.2.4 on 2021-11-08 12:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20211108_1720'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_stats',
            name='time',
            field=models.CharField(default='Not Available', max_length=30),
        ),
    ]
