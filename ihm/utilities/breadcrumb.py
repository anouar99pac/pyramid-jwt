# -*- coding: utf-8 -*-
"""
Déclaration de la classe permettant d'obtenir un fil d'ariane"""
import logging
from pyramid.response import Response
LOG = logging.getLogger('breadcrumb_')

BREADCRUMB = {
    '/neteven/home': {},#[{'msg_id': 'ihm.root.home_start', 'route_url':'/neteven/home'}],
    'accueil': [{'msg_id': 'ihm.root.home_start', 'route_url':''}],
    'home': [{'msg_id': 'ihm.root.home_start', 'route_url':'/neteven/home'}],
    'console_mapping': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.console_mapping', 'route_url':'/console-mapping'}
    ],
    'purge_accounts': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.internal_settings', 'route_url':''},
        {'msg_id': 'ihm.purge-accounts', 'route_url':'/neteven/purge-accounts'}
    ],
    'marketplace_management': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.internal_settings', 'route_url':''},
        {'msg_id': 'ihm.marketplace_management', 'route_url':'/marketplace_management'}
    ],
    'account_management': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.internal_settings', 'route_url':''},
        {'msg_id': 'ihm.account_management', 'route_url':'/account_management'}
    ],
    'categorisation_automatique_ihm': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.auto-classifier', 'route_url':'/neteven/auto-classifier'}
    ],
    '/gestion-messages/listing-messages': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.gestion_messages', 'route_url':''}
    ],
    'console_mapping_mapping_attribut': [
        {'msg_id': 'ihm.root.home_start', 'route_url': ''},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.console_mapping', 'route_url':'/console-mapping'},
        {'msg_id': 'ihm.CDM.mapping_attributs', 'route_url':''},
    ],
    '/neteven/publish_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':'/neteven/publish_models'},
    ],
    '/neteven/publimates':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.publimates', 'route_url':'/neteven/publimates'},
    ],
    '/neteven/export_publimates':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.publimates', 'route_url':'/neteven/export_publimates'},
    ],

    '/neteven/automation_setting':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.automation_setting', 'route_url':'/neteven/automation_setting'},
    ],
    '/neteven/automation_setting_1':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.automation_setting', 'route_url':'/neteven/automation_setting_1'},
    ],
    '/neteven/automation_setting_2':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.automation_setting', 'route_url':'/neteven/automation_setting_2'},
    ],
    '/neteven/offers':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.listings', 'route_url':'/neteven/offers'},
    ],
    '/neteven/export_offers':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.listings', 'route_url':'/neteven/export_offers'},
    ],
    '/neteven/orders':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.orders', 'route_url':'/neteven/orders'},
    ],
    '/neteven/export_orders':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.orders', 'route_url':'/neteven/export_orders'},
    ],
    '/neteven/inventory':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.inventory', 'route_url':'/neteven/inventory'},
    ],
    '/neteven/export_inventory':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url': ''},
        {'msg_id': 'ihm.root.inventory', 'route_url':'/neteven/export_inventory'},
    ],
    '/neteven/folders':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.inventory', 'route_url':''},
        {'msg_id': 'ihm.root.folders_managements', 'route_url':'/neteven/folders'},
    ],
    '/neteven/translation':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.inventory', 'route_url':''},
        {'msg_id': 'ihm.root.tracking_translations', 'route_url':'/neteven/translation'},
    ],
    '/neteven/customised_import_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.import_data', 'route_url':''},
        {'msg_id': 'ihm.root.customised_import_models', 'route_url':'/neteven/customised_import_models'},
    ],
    '/neteven/category_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':''},
        {'msg_id': 'ihm.models.category_models', 'route_url':'/neteven/category_models'},
    ],
    '/neteven/description_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':''},
        {'msg_id': 'ihm.models.description_models', 'route_url':'/neteven/description_models'},
    ],
    '/neteven/payment_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':''},
        {'msg_id': 'ihm.models.payment_models', 'route_url':'/neteven/payment_models'},
    ],
    '/neteven/shipping_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':''},
        {'msg_id': 'ihm.models.shipping_models', 'route_url':'/neteven/shipping_models'},
    ],
    '/neteven/scheduler_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':''},
        {'msg_id': 'ihm.models.scheduler_models', 'route_url':'/neteven/scheduler_models'},
    ],
    '/neteven/posting_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.publication', 'route_url':''},
        {'msg_id': 'ihm.root.models', 'route_url':''},
        {'msg_id': 'ihm.models.posting_models', 'route_url':'/neteven/posting_models'},
    ],
    '/neteven/notifications':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.notifications', 'route_url':'/neteven/notifications'},
    ],
    '/neteven/import_items':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.import_data', 'route_url':''},
        {'msg_id': 'ihm.root.inventory_import', 'route_url':'/neteven/import_items'},
    ],
    '/neteven/import_orders':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.import_data', 'route_url':''},
        {'msg_id': 'ihm.root.orders_import', 'route_url':'/neteven/import_orders'},
    ],
    '/neteven/product_feeds_import':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.import_data', 'route_url':''},
        {'msg_id': 'ihm.root.customised_import_models', 'route_url':''},
        {'msg_id': 'ihm.root.inventory', 'route_url':'/neteven/product_feeds_import'},
    ],
    '/neteven/order_feeds_import':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.import_data', 'route_url':''},
        {'msg_id': 'ihm.root.customised_import_models', 'route_url':''},
        {'msg_id': 'ihm.root.orders', 'route_url':'/neteven/order_feeds_import'},
    ],
    '/neteven/translations':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.inventory', 'route_url':''},
        {'msg_id': 'ihm.root.tracking_translations', 'route_url':'/neteven/translations'},
    ],
    '/neteven-reporting':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.squid', 'route_url':'/neteven-reporting'},
    ],
    '/neteven/product_feeds_export':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.export_models', 'route_url': ''},
        {'msg_id': 'ihm.root.inventory', 'route_url':'/neteven/product_feeds_export'},
    ],
    '/neteven/publimate_feeds_export':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.export_models', 'route_url': ''},
        {'msg_id': 'ihm.root.publimates', 'route_url':'/neteven/publimate_feeds_export'},
    ],
    '/neteven/listing_feeds_export':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.export_models', 'route_url': ''},
        {'msg_id': 'ihm.root.listings', 'route_url':''},
    ],
    '/neteven/order_feeds_export':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.export_data', 'route_url':''},
        {'msg_id': 'ihm.root.export_models', 'route_url': ''},
        {'msg_id': 'ihm.root.orders', 'route_url':'/neteven/listing_feeds_export'},
    ],
    '/neteven/accounts_marketplaces':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.my_marketplaces', 'route_url':''},
    ],
    '/neteven/accounts_informations':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.personal_information', 'route_url':'/neteven/accounts_marketplaces'},
    ],
    '/neteven/invoices':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.neteven_bills', 'route_url':''},
    ],
    '/neteven/invoices':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.neteven_bills', 'route_url':'/neteven/invoices'},
    ],
    '/neteven/emails_and_feedbacks':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.emails_and_feedbacks', 'route_url':'/neteven/emails_and_feedbacks'},
    ],
    '/neteven/printing_models':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.delivery_document', 'route_url':''},
    ],
    '/neteven/preference':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.preferences', 'route_url':'/neteven/printing_models'},
    ],
    '/neteven/warehouses':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.my_warehouses', 'route_url':''},
    ],
    '/neteven/taxes':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.account', 'route_url':''},
        {'msg_id': 'ihm.root.taxes', 'route_url':'/neteven/warehouses'},
    ],
    '/neteven/support_contact':[
        {'msg_id': 'ihm.root.home_start', 'route_url': '/neteven/home'},
        {'msg_id': 'ihm.root.help_and_support', 'route_url':''},
        {'msg_id': 'ihm.root.support_center', 'route_url':'/neteven/support_contact'},
    ],

}

def set_breadcrumb():
    """ permet de récupérer le fil d'ariane du request en cours"""
    def _breadcrumb(wrapped_view):
        def breadcrumb_(request):
            route_name = request.matched_route.name
            if 'zope' in route_name:
                route_name = request.path
            # LOG.info('get breadcrumb to request %s', str(request.matched_route.name))
            request.breadcrumb = BREADCRUMB.get(route_name)
            if not request.breadcrumb:
                request.breadcrumb = []
            response = wrapped_view(request)
            return response
        return breadcrumb_
    return _breadcrumb
