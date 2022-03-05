
# Start and testing Email Service

Per poter testare l'invio dell'email attivare i seguenti servizi:

- MailHog
``` docker
    docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

- Servizio mqtt
``` bash
    cd service/mqtt
    ./start.sh  # Run mqtt service 
```

- Servizio email
``` bash
    cd service/email_py
    python mail.py  # Run mail service
```