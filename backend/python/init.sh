python3 helpers.py

python3 manage.py makemigrations
python3 manage.py migrate

python manage.py populate_users

exec python3 manage.py runserver '0.0.0.0:8000' # deamon mode