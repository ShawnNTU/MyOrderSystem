import subprocess



try :
    django = subprocess.Popen(["python", "./manage.py", "runserver", "192.168.0.14:8000"])
    mongo = subprocess.Popen(["mongod", "-f" "./MongoDB/mongod.cfg"])   
    print("伺服器運行中")
    django.wait()
    mongo.wait()
except KeyboardInterrupt:
    print("關閉伺服器")
    django.terminate()
    mongo.terminate()