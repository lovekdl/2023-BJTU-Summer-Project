from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class SimpData(models.Model):
    pl_name = models.TextField(blank=True, null=True)
    sy_snum = models.BigIntegerField(blank=True, null=True)
    sy_pnum = models.BigIntegerField(blank=True, null=True)
    orbit_period = models.FloatField(db_column='Orbit_period', blank=True, null=True)  # Field name made lowercase.
    semi_major_axis = models.FloatField(db_column='Semi_major_axis', blank=True, null=True)  # Field name made lowercase.
    radius_eu_field = models.FloatField(db_column='Radius (EU)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    mass_eu_field = models.FloatField(db_column='Mass (EU)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    st_teff = models.FloatField(blank=True, null=True)
    stellar_radius = models.FloatField(db_column='Stellar_radius', blank=True, null=True)  # Field name made lowercase.
    stellar_mass = models.FloatField(db_column='Stellar_mass', blank=True, null=True)  # Field name made lowercase.
    stellar_luminosity = models.FloatField(db_column='Stellar_luminosity', blank=True, null=True)  # Field name made lowercase.
    st_logg = models.FloatField(blank=True, null=True)
    esi = models.FloatField(db_column='ESI', blank=True, null=True)  # Field name made lowercase.
    ishabitable = models.BigIntegerField(db_column='isHabitable', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'simplifiedplanetdata'

class Exoplanets(models.Model):
    planet_name = models.TextField(db_column='Planet_name', blank=True, null=True)  # Field name made lowercase.
    orbit_period = models.FloatField(db_column='Orbit_period', blank=True, null=True)  # Field name made lowercase.
    semi_major_axis = models.FloatField(db_column='Semi_major_axis', blank=True, null=True)  # Field name made lowercase.
    eccentricity = models.FloatField(db_column='Eccentricity', blank=True, null=True)  # Field name made lowercase.
    mass_eu_field = models.FloatField(db_column='Mass (EU)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    radius_eu_field = models.FloatField(db_column='Radius (EU)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    density = models.FloatField(db_column='Density', blank=True, null=True)  # Field name made lowercase.
    eqilibrium_temp = models.FloatField(db_column='Eqilibrium_temp', blank=True, null=True)  # Field name made lowercase.
    insolation_flux = models.FloatField(db_column='Insolation_flux', blank=True, null=True)  # Field name made lowercase.
    distance = models.FloatField(db_column='Distance', blank=True, null=True)  # Field name made lowercase.
    effective_temp = models.FloatField(db_column='Effective_temp', blank=True, null=True)  # Field name made lowercase.
    surface_stellar_gravity = models.FloatField(db_column='Surface_Stellar_gravity', blank=True, null=True)  # Field name made lowercase.
    stellar_luminosity = models.FloatField(db_column='Stellar_luminosity', blank=True, null=True)  # Field name made lowercase.
    stellar_mass = models.FloatField(db_column='Stellar_mass', blank=True, null=True)  # Field name made lowercase.
    stellar_radius = models.FloatField(db_column='Stellar_radius', blank=True, null=True)  # Field name made lowercase.
    habitable = models.BigIntegerField(db_column='Habitable', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'exoplanets'


class Planet(models.Model):
    id = models.BigAutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'main_planet'


class User(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    username = models.CharField(unique=True, max_length=20)
    password = models.CharField(max_length=20)
    email = models.CharField(unique=True, max_length=50)
    authority = models.IntegerField(default=0)
    avatar = models.TextField()

    class Meta:
        managed = False
        db_table = 'main_user'


class Verifycodes(models.Model):
    username = models.CharField(primary_key=True, max_length=20)
    vrcode = models.CharField(max_length=6)

    class Meta:
        managed = False
        db_table = 'main_verifycodes'

class UserLikedPlanets(models.Model):
    username = models.CharField(max_length=20)
    planetname = models.CharField(max_length=20)
    
class UserCreatedPlanets(models.Model):
    token = models.CharField(max_length=100)
    planet_name = models.TextField(db_column='Planet_name', blank=True, null=True)
    orbit_period = models.FloatField(db_column='Orbit_period', blank=True, null=True)  
    semi_major_axis = models.FloatField(db_column='Semi_major_axis', blank=True, null=True) 
    mass_eu_field = models.FloatField(db_column='Mass (EU)', blank=True, null=True)
    radius_eu_field = models.FloatField(db_column='Radius (EU)', blank=True, null=True)
    stellar_luminosity = models.FloatField(db_column='Stellar_luminosity', blank=True, null=True)
    stellar_mass = models.FloatField(db_column='Stellar_mass', blank=True, null=True)
    stellar_radius = models.FloatField(db_column='Stellar_radius', blank=True, null=True)
    esi = models.FloatField(db_column='ESI', blank=True, null=True)
    habitable = models.CharField(db_column='Habitable', blank=True, null=True, max_length=20)
    
