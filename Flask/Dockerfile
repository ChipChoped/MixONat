FROM python:3.9

WORKDIR /app/flask/

COPY ./requirements.txt /app/flask/

RUN pip install virtualenv && virtualenv flask && . flask/bin/activate
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y default-jdk

ENV FLASK_ENV=development

COPY . /app/flask/
RUN rm -rf downloads && mkdir downloads
RUN chmod +x /app/flask/NMRshift/predictSdf.bat

ENTRYPOINT FLASK_APP=/app/flask/main.py flask run --host=0.0.0.0 --debugger
