FROM    python:3.10-slim

WORKDIR /app

COPY    requirements.txt .

RUN     pip install --no-cache-dir -r requirements.txt 

COPY    . .

RUN    python manage.py collectstatic --noinput

# RUN    python manage.py migrate

expose  3000

COPY init.sh /usr/bin/

ENTRYPOINT [ "sh", "/usr/bin/init.sh" ]

CMD     ["gunicorn", "authentication_service.wsgi:application", "--bind", "0.0.0.0:3000"]