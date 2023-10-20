# MixONat

## Getting started

### Launching the MixONat server

A version of Python 3.9 or higher is required.

```bash
pip install -r ./Flask/requirements.txt
python ./Flask/main.py
```

### Launching the website server

You must first define the environment variable JAVA_HOME to the path of your JDK installation.

```bash
cd ./Conductor/
./mvnw.cmd compile spring-boot:run
```

### Launching the website client

```bash
npm install react-scripts --save --prefix ./react/my-app/
npm start --prefix ./react/my-app/
```