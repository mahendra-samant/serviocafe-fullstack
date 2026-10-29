from django.db import migrations,models
class Migration(migrations.Migration):
    initial=True; dependencies=[]
    operations=[migrations.CreateModel(name='Table',fields=[('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name='ID')),('table_number',models.IntegerField(unique=True)),('seats',models.IntegerField()),('available',models.BooleanField(default=True))])]
