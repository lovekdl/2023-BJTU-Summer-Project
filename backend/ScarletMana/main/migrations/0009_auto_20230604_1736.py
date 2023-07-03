# Generated by Django 3.2.15 on 2023-06-04 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_alter_player_resource_refresh_count_max'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='employ_dwarf_price',
            field=models.IntegerField(default=10),
        ),
        migrations.AlterField(
            model_name='player',
            name='motto',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='resource_refresh_count',
            field=models.IntegerField(default=10),
        ),
        migrations.AlterField(
            model_name='player',
            name='title',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
