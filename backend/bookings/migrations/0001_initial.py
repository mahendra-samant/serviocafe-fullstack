from django.db import migrations,models
import django.db.models.deletion
class Migration(migrations.Migration):
    initial=True; dependencies=[('users','0001_initial'),('tables','0001_initial')]
    operations=[migrations.CreateModel(name='TableBooking',fields=[('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name='ID')),('booking_time',models.DateTimeField()),('number_of_people',models.IntegerField()),('status',models.CharField(choices=[('CONFIRMED','Confirmed'),('CANCELLED','Cancelled'),('COMPLETED','Completed')],default='CONFIRMED',max_length=20)),('created_at',models.DateTimeField(auto_now_add=True)),('table',models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='bookings',to='tables.table')),('user',models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='bookings',to='users.user'))])]
