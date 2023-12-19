FROM python:3.9

WORKDIR /app/flask/

COPY ./requirements.txt /app/flask/

RUN pip install virtualenv && virtualenv flask && . flask/bin/activate
RUN pip install -r requirements.txt

ENV FLASK_ENV=development

COPY . /app/flask/
ENTRYPOINT FLASK_APP=/app/flask/main.py flask run --host=0.0.0.0 --debugger
