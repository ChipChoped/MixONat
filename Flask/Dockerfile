FROM python:3.9

WORKDIR /app/flask/

COPY ./requirements.txt /app/flask/

RUN pip install virtualenv && virtualenv flask && . flask/bin/activate
RUN pip install -r requirements.txt

COPY . /app/flask/
CMD ["python", "main.py"]