# -*- coding: utf-8 -*-
import json
import ast
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPUnauthorized

def get_account_id(request):
    """ Retourne l'account_id
    """
    return int(request.session['user']['account_id'])


def get_default_language_id(request):
    """ Retourne le language_id par default de l'user
    """
    return request.session['user']['default_language']


def get_current_language_id(request):
    """ Make a seperate call with new return because
        Don't mix with getDefaultLanguageId
    """
    try:
        return request.localizer.locale_name
    except:
        return 'fr'


def getGroupId(request):
    return request.session['credentials']['group_id']


def isAccountManager(request):
    try:
        group_id = getGroupId(request)
    except:
        group_id = 1
    if group_id == 2:
        return True
    else:
        return False


def get_group_of_user(request):
    """
        return a list of group membreOf
    """
    return request.session['user']['memberOf']


def get_user_type(request):
    """
        return if we are Customers or Users of Neteven
    """
    return request.session['user']['userHandler']


def check_plugin(request, type_of_user, route_name, plugin_name):

    group_list = ast.literal_eval(request.registry.settings['authorised_groups'])
    group = group_list[plugin_name].split(',')
    # print tmp['purge_account_ihm']
    user_groups = get_group_of_user(request)
    user_type = get_user_type(request)
    if len(group) == 0:
        if type_of_user == user_type and request.registry.introspector.get('routes', route_name):
            return True
        else:
            return False
    else:
        if type_of_user == user_type and len([elem for elem in group if elem in user_groups])>0 and request.registry.introspector.get('routes', route_name):
            return True
        else:
            return False


def check_group_of_user(request, type_of_user, plugin_name):
    group_list = ast.literal_eval(request.registry.settings['authorised_groups'])
    if plugin_name in group_list:
        group = group_list[plugin_name].split(',')
        # print authorised
        user_groups = get_group_of_user(request)
        user_type = get_user_type(request)
        print('user_groups : {} ---- user_type : {}'.format(user_groups,user_type))

        if len(group) == 0:
            if type_of_user == user_type:
                return True
            else:
                return False
        else:
            if type_of_user == user_type and len([elem for elem in group if elem in user_groups])>0:
                return True
            else:
                return False
    else:
        return False


def denied_external_links(plugin_name):
    """ Forbid access for any external link without the right
        access
    """
    def decorated(view_function):
            def wrapper(request):
                if check_group_of_user(request, 'Users', plugin_name):
                    return view_function(request)
                else:
                    return HTTPUnauthorized()
            return wrapper
    return decorated

