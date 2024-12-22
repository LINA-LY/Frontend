# Generated by Django 5.1.4 on 2024-12-22 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dossier_patient', '0004_compterendu'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='soin',
            name='description',
        ),
        migrations.AddField(
            model_name='soin',
            name='medicaments_administres',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='soin',
            name='observastions',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='soin',
            name='soins_infirmiers',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
