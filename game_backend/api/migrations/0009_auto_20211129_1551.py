# Generated by Django 3.2.4 on 2021-11-29 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_image_data'),
    ]

    operations = [
        migrations.DeleteModel(
            name='image_data',
        ),
        migrations.AddField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
