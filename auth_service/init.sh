python3 manage.py makemigrations authentication_service
python3 manage.py migrate authentication_service
python3 manage.py makemigrations friends
python3 manage.py migrate friends
exec "$@"