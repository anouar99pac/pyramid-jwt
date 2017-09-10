# -*- coding: utf-8 -*-
# pylint: disable=W0613

"""
    # CONSTANTES D'ENVIRONNEMENT
"""

# CODE COMMUNICATION
STATUS_CODE = {
    'success': 0,
    'generic_error': 1,
    'database_error': 2,
    'network_error': 3,
}


# IP AUTORISÉE pour accés en account_manager et/ou acces intranet
ALLOWED_NETEVEN_IPS = [
    '127.0.0.1',  # localhost Dev
    '159.180.255.62',  # La fibre
    '172.25',  # Prod
    '172.20',  # PI
    '78.207.142.193',  # TSimon
    '88.164.88.90',  # Mjoigny
    '37.187.155.56',  # sup.neteven.com
    '5.135.111.112',  # supproxy.neteven.com
]
