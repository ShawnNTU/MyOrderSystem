from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse

from .DBOperation import handleAddOrder, handleGetFilteredOrder, handleUpdateOrder, handleDeleteOrder
    
import json
from dateutil.parser import parse as dateParser

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

def databaseView(request:HttpRequest):
    return render(request, 'database.html')

def decodeBody(request:HttpRequest)->dict:
    body_unicode = request.body.decode('utf-8')
    body_data = json.loads(body_unicode)
    return body_data


"""
respone:{
    "Django Status":"Success" or "Error"
    other_attributes: ...
    ...
}
"""

DJANGO_STATUS = "Django Status"
SUCCESS = "Success"
ERROR = "Error"
DETAIL = "detail"


def receiveAddOrder(request:HttpRequest):
    added_order = decodeBody(request)
    add_result = handleAddOrder(added_order)
    if add_result["MongoStatus"] == "Sucess":
        return JsonResponse({DJANGO_STATUS:SUCCESS,"_id":add_result["_id"]})
    else:
        return JsonResponse({DJANGO_STATUS:ERROR,DETAIL:add_result})

def receiveFilter(request:HttpRequest):
    """
    default_rules = {
        "start_time":"",
        "end_time":"",
        "status":"unfinished",
        "types":"pickup_time" // "pickup_time" or "order_time"
    }
    """
    # TODO
    # transform datetime into UTC datetime object, then insert into the DB
    # instead just string
    filter = decodeBody(request)
    # filter by status first
    find_result = handleGetFilteredOrder({"status":filter["status"]})
    if find_result["MongoStatus"] == "Sucess":
        filtered_order = find_result["data"]
        if filtered_order == []:
            return JsonResponse({DJANGO_STATUS:SUCCESS,"data":filtered_order})
    else:
        #TODO maybe do something more here
        return JsonResponse({DJANGO_STATUS:ERROR,DETAIL:find_result})
    
    # process the judgement about datetime in python
    start_time = dateParser(filter["start_time"]) if filter["start_time"] != "" else 0
    end_time = dateParser(filter["end_time"]) if filter["end_time"] != "" else 0
        
    def both(target_time):
        return ((target_time >= start_time) and (target_time <= end_time))
    def start(target_time):
        return target_time >= start_time
    def end(target_time):
        return target_time <= end_time
    
    if start_time != 0 and end_time != 0:
        judge_function = both
    elif start_time != 0:
        judge_function = start
    elif end_time != 0:
        judge_function = end
    else:
        judge_function = False
    
    output = []
    if judge_function != False:
        for order in filtered_order:
            target_time = dateParser(order["customer_info"][filter["types"]])
            if judge_function(target_time):
                output.append(order)
    else:
        output = filtered_order      

    output.sort(key=lambda x : dateParser(x["customer_info"][filter["types"]]), reverse=False)
    return JsonResponse({DJANGO_STATUS:SUCCESS,"data":output})

def receiveEditedOrder(request:HttpRequest):
    updated_order = decodeBody(request)
    update_result = handleUpdateOrder(updated_order["_id"], updated_order["data"])
    if update_result["MongoStatus"] == "Sucess":
        return JsonResponse({DJANGO_STATUS:SUCCESS})
    else:
        return JsonResponse({DJANGO_STATUS:ERROR, DETAIL:update_result})

def receiveDeletedOrder(request:HttpRequest):
    _id_of_deleted_order = decodeBody(request)
    delete_result = handleDeleteOrder(_id_of_deleted_order)
    if delete_result["MongoStatus"] == "Sucess":
        return JsonResponse({DJANGO_STATUS:SUCCESS})
    else:
        return JsonResponse({DJANGO_STATUS:ERROR, DETAIL:delete_result})


