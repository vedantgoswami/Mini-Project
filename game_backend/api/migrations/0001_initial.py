# Generated by Django 3.2.4 on 2021-06-21 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='state',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('head_x', models.IntegerField(default=1)),
                ('head_y', models.IntegerField(default=1)),
                ('food_x', models.IntegerField(default=1)),
                ('food_y', models.IntegerField(default=1)),
            ],
        ),
    ]
