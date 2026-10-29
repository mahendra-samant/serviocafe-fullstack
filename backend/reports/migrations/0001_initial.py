from django.db import migrations,models
import django.db.models.deletion
class Migration(migrations.Migration):
    initial=True; dependencies=[('users','0001_initial')]
    operations=[migrations.CreateModel(name='Report',fields=[('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name='ID')),('type',models.CharField(max_length=100)),('message',models.TextField()),('created_at',models.DateTimeField(auto_now_add=True)),('user',models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='reports',to='users.user'))])]
