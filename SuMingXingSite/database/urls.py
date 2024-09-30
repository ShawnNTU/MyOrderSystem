
from django.urls import path
from . import views

app_name = "DatabaseFrontend"

urlpatterns = [
    # path('', views.databaseView),
    path('', views.databaseView),
    path('addOrder', views.receiveAddOrder),
    path('getOrder', views.receiveFilter),
    path('editOrder', views.receiveEditedOrder),
    path('deleteOrder', views.receiveDeletedOrder),
]