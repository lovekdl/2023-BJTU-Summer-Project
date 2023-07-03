from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin

admin.site.register(User)
admin.site.register(Planet)

