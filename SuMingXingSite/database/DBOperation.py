from pymongo import MongoClient
from pymongo.synchronous.collection import Collection
from bson import ObjectId

# checkout https://pymongo.readthedocs.io/en/stable/api/pymongo/index.html

DEBUG = False
CURRENT_COLLECTION = "testCollection" if DEBUG else "orderCollection"

URI = "mongodb://192.168.0.13:27017/?directConnection=true"
DB_NAME = 'orderDB'
CLIENT = None

def connectDBandGetCollection():
    global CLIENT
    CLIENT = MongoClient(URI)
    return CLIENT[DB_NAME][CURRENT_COLLECTION]

def disconnectDB():
    global CLIENT
    if CLIENT != None:
        CLIENT.close()
        CLIENT = None


# =============== Basic Operation ===============

"""
response :{
    "MongoStatus":"Sucess" or "Error"
    "message":detail about status and operation
    other_attributes: ...
    ...
}
"""

def insertDocument(collection:Collection, doc):
    # see https://pymongo.readthedocs.io/en/stable/api/pymongo/results.html#pymongo.results.InsertOneResult
    insert_result = collection.insert_one(doc)
    if insert_result.acknowledged:
        response = {
            "MongoStatus":"Sucess",
            "message":"Insert Sucess",
            "_id": str(insert_result.inserted_id)
        }
    else:
        response = {
            "MongoStatus":"Error",
            "message":"Insert Error",
        }
    return response
    
def findDocuments(collection:Collection, filter):
    # see https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.find
    # before 4.9.1, it's same using list(Cursor) and [doc for doc in Cursor]
    # because they both use __getitem__ to get each document in the cursor
    # find_result = list(collection.find(filter))
    
    # but after 4.9.1, a cursor support to_list() method
    # in "to_list()", it will:
    # call "_next_batch()" method to get a batch of data
    # inside "_next_batch()", it will call "_refresh()" method to move many data into a queue called "_data"
    # then "_next_batch()" move those data into the list specified by to_list()
    
    try:
        find_result = collection.find(filter).to_list()    
        for doc in find_result:
            doc["_id"] = str(doc["_id"]) # change id into string
        response = {
            "MongoStatus":"Sucess",
            "message":"Find Sucess",
            "data":find_result,
        }
        return response
    except Exception as e:
        response = {
            "MongoStatus":"Error",
            "message":f"MongoDB Error: {str(e)}",
        }
        return response

def findDocumentByID(collection:Collection, id):
    return findDocuments(collection, {'_id':ObjectId(id)})
    
def updateDocumentByID(collection:Collection, id, updatevalues):
    id_filter = {'_id':ObjectId(id)}
    update_object = {'$set':updatevalues}
    update_result = collection.update_one(filter=id_filter, update=update_object)
    if update_result.acknowledged:
        response = {
            "MongoStatus":"Sucess",
            "message":"Update Sucess",
            "matched_count":update_result.matched_count,
            "modified_count":update_result.modified_count
        }
    else:
        response = {
            "MongoStatus":"Error",
            "message":"Update Error",
        }
    return response

def deleteDocumentByID(collection:Collection, id):
    delete_result =  collection.delete_one({'_id':ObjectId(id)})
    if delete_result.acknowledged:
        response = {
            "MongoStatus":"Sucess",
            "message":"Delete Sucess",
            "deleted_count":delete_result.deleted_count,
        }
    else:
        response = {
            "MongoStatus":"Error",
            "message":"Delete Error",
        }    
    return response


# ================ CRUD ================

def handleGetFilteredOrder(filter):
    collection = connectDBandGetCollection()
    find_result = findDocuments(collection, filter)
    disconnectDB()
    return find_result

def handleGetAllOrder():
    return handleGetFilteredOrder({})

def handleGetUnfinishedOrder():
    return handleGetFilteredOrder({"status":"unfinished"})

def handleAddOrder(order):
    collection = connectDBandGetCollection()
    insert_result = insertDocument(collection, order)
    disconnectDB()
    return insert_result

def handleUpdateOrder(_id, order):
    collection = connectDBandGetCollection()
    update_result = updateDocumentByID(collection, _id, order)
    disconnectDB()
    return update_result

def handleDeleteOrder(_id):
    collection = connectDBandGetCollection()
    delete_result = deleteDocumentByID(collection, _id)
    disconnectDB()
    return delete_result

"""
order format : {
    status: // required, "finished" or "unfinished"
    customer_info:{
        name:str, // required
        phone_list:[, //optional, default empty array
            {
                id:int, 
                number:str,
            },...
        ]
        order_time:str // required
        pickup_time:str // required
    }
    item_list:[ // required
        {
            id:
            name:
            amount:
            sub_item_list:[ // depend on the type of the item
                {
                    sub_id
                    sub_name:,
                    sub_amount:
                }
            ]
        }
        
    ]
}
"""