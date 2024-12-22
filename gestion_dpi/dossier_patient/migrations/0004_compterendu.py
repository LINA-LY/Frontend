# Generated by Django 5.1.4 on 2024-12-22 13:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dossier_patient', '0003_soin'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompteRendu',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('radiologue', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('image_radio', models.ImageField(blank=True, null=True, upload_to='radio_images/')),
                ('dossier_medical', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='compte_rendus', to='dossier_patient.dossiermedical')),
            ],
        ),
    ]
