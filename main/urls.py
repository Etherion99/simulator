from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='home'),
	path('pruebas', views.pruebas, name='pruebas'),
	path('simulation', views.simulation, name='simulation')
]