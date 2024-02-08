# MixONat

## Getting started


### Three services are available :
```
Front : react-mixonat
Back : conductor-mixonat
DB : postgres
Motor : flask
```

### Launching container

```bash
docker-compose build
docker-compose up
```

### Launching a specific service

```bash
docker-compose build [service]
docker-compose up [service]
```

### To test the API
Make sure all services are running, then run the following commands:

```bash
cd ./Conductor/
mvn test
```
