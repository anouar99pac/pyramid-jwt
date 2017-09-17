ihm README
==================

h1. Welcome to the pyramid-jwt wiki! Prepare your environment of Pyramid, we work with python 3.5

- anouar99pac: sudo apt-get install python-virtualenv
- anouar99pac: mkdir -p Projects/pyramid-demo
- anouar99pac: virtualenv -p /usr/bin/python3 Projects/pyramid-demo
- Already using interpreter /usr/bin/python3
- Using base prefix '/usr'
- New python executable in Projects/pyramid-demo/bin/python3
- Also creating executable in Projects/pyramid-demo/bin/python
- Installing setuptools, pip...done.
- anouar99pac: cd Projects/pyramid-demo
- anouar99pac: . bin/activate


pip install pyramid

after we can use command of pyramid to create a structure of the project :

pcreate -s alchemy PyramidDemo && echo ok

pserve developement.ini

curl -O http://127.0.0.1:8880/test-api

Or you can git clone my project : (after you activate you env virtual in py 3.5)

pip install -e .

Getting Started
---------------

- cd <directory containing this file>

- $VENV/bin/python setup.py develop

- $VENV/bin/pserve development.ini

DEMO: 

![screenshot_from_deom](https://user-images.githubusercontent.com/12816334/30252045-c25ef3e6-966b-11e7-9c57-b99e340e3c2b.png)
