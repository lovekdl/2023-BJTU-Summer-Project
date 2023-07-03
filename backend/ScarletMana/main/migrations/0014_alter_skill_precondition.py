# Generated by Django 3.2.15 on 2023-06-14 13:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_skillstudy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='skill',
            name='precondition',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='main.skill'),
        ),
    ]
