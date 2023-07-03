from django.contrib import admin
from .models import *
from .resources import *
from import_export.admin import ImportExportModelAdmin

# Import_Export
class SkillAdmin(ImportExportModelAdmin):
    resource_class = SkillResource

# Register your models here.
admin.site.register(Player)
admin.site.register(DwarfFirstname)
admin.site.register(DwarfSecondname)
admin.site.register(Dwarf)
admin.site.register(Skill, SkillAdmin)
admin.site.register(SkillLearn)
