# This file is for django_import_export

from import_export import resources
from .models import *

class SkillResource(resources.ModelResource):

    class Meta:
        model = Skill
        exclude = ('id', )