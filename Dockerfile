FROM python:3

WORKDIR /app

COPY requirement.txt  ./

COPY init.sh ./

RUN python3 -m pip install -r requirement.txt

ENTRYPOINT [ "sh", "init.sh" ]