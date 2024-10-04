# MyOrderSystem

這是一個給我家店裡用的資料庫系統，可以用來新增、編輯、刪除跟統計訂單。
因為只是給家裡使用，所以限制為透過連上家裡 WiFi 的設備來連上這個資料庫系統。
訂單格式是針對我家情況設計的。

This is an order database system designed for managing orders at my family-run Chinese bakery. It allows adding, editing, deleting, and summarizing orders.
Access to the system is restricted to devices connected to our WiFi network, ensuring it’s exclusively for family use.
The order format has been customized to suit our specific needs.

## Design

- Database:MongoDB
- Backend:Django
- Frontend:React

## How to use

1. Download MongoDB and start an instance with a specific host and port. (one can put these settings in a customed mongod.cfg file)
2. Run Django server with a specific host and port.

one need to replace the path to connecting ones MongoDB in the 10 line of `SuMingXingSite/database/DBOperation.py`.

## Required Python Modules

- Django
- django-cors-headers
- pymongo >= 4.9.1
